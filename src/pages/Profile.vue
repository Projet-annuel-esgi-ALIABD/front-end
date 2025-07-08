<script setup lang="ts">
import { ref, computed, onMounted, toRaw } from 'vue';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import NavBar from '@/components/navbar.vue';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UserIcon, ShieldIcon, SettingsIcon, BellIcon, PlusIcon, Trash2Icon, EditIcon, AlertTriangleIcon, InfoIcon, CheckCircleIcon } from 'lucide-vue-next';
import environment from '@/environment/environment';
import axios from 'axios';

type AlertType = 'info' | 'warning' | 'critical';

interface Alert {
    id: number;
    type: AlertType;
    message: string;
    createdAt: string;
    isActive: boolean;
    updatedAt?: string;
}

const { toast } = useToast();

const user = ref<any>(null);
const isAdmin = computed(() => user.value?.role === 'admin');
const isLoading = ref(true);
const isSavingThresholds = ref(false);
const isCreatingAlert = ref(false);

// Threshold settings
const thresholds = ref({ airQuality: 50, traffic: 80, noise: 70, temperature: 35 });
const newThresholds = ref({ ...thresholds.value });

// Alert management
const alerts = ref<Alert[]>([]);
const editingAlert = ref<Alert | null>(null);
const isDialogOpen = ref(false);

// Alert form validation schema
const alertSchema = z.object({
    type: z.enum(['info', 'warning', 'critical'], {
        errorMap: () => ({ message: 'Please select a valid alert type' })
    }),
    message: z.string().min(5, 'Message must be at least 5 characters').max(200, 'Message must be less than 200 characters'),
});

// Setup alert form
const { handleSubmit: handleAlertSubmit, errors: alertErrors, values: alertValues, setFieldValue: setAlertFieldValue, resetForm } = useForm({
    validationSchema: toTypedSchema(alertSchema),
    initialValues: {
        type: 'info' as AlertType,
        message: ''
    }
});

onMounted(async () => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode JWT token to get user info (simplified)
                await axios.get(`${environment.apiUrl}/api/user/`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(response => {
                    user.value = response.data;
                    user.value.role = user.value.is_staff ? 'admin' : 'user';
                });
            } catch (error) {
                console.log(error);
                toast({ 
                    title: 'Error', 
                    description: 'Failed to decode user data. Please log in again.', 
                    variant: 'destructive' 
                });
            }
        } else {
            toast({ 
                title: 'Warning', 
                description: 'You are not logged in. Some features may be limited.', 
                variant: 'destructive' 
            });
        }

        // Mock alerts data - in real app, fetch from API
        alerts.value = [
            { 
                id: 1, 
                type: 'critical', 
                message: 'Air quality threshold exceeded in downtown area', 
                createdAt: new Date().toISOString(),
                isActive: true 
            },
            { 
                id: 2, 
                type: 'warning', 
                message: 'Traffic congestion detected on main routes', 
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                isActive: true 
            },
            { 
                id: 3, 
                type: 'info', 
                message: 'Scheduled maintenance on sensors', 
                createdAt: new Date(Date.now() - 7200000).toISOString(),
                isActive: false 
            }
        ];
    } catch (e) {
        console.error('Error loading profile:', e);
        toast({ 
            title: 'Error', 
            description: 'Failed to load profile data', 
            variant: 'destructive' 
        });
    } finally {
        isLoading.value = false;
    }
});

const saveThresholds = async () => {
    if (!isAdmin.value) return;
    
    isSavingThresholds.value = true;
    try {
        // In real app: await axios.put(`${environment.apiUrl}/api/thresholds/`, newThresholds.value, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        thresholds.value = { ...newThresholds.value };
        toast({ 
            title: 'Settings saved', 
            description: 'Threshold settings have been updated successfully',
        });
    } catch (e) {
        console.error('Error saving thresholds:', e);
        toast({ 
            title: 'Error', 
            description: 'Failed to update threshold settings', 
            variant: 'destructive' 
        });
    } finally {
        isSavingThresholds.value = false;
    }
};

const openAlertDialog = (alert?: Alert) => {
    if (alert) {
        editingAlert.value = alert;
        setAlertFieldValue('type', alert.type);
        setAlertFieldValue('message', alert.message);
    } else {
        editingAlert.value = null;
        resetForm();
    }
    isDialogOpen.value = true;
};

const closeAlertDialog = () => {
    isDialogOpen.value = false;
    editingAlert.value = null;
    resetForm();
};

const onAlertSubmit = handleAlertSubmit(async (values) => {
    if (!isAdmin.value) return;
    
    isCreatingAlert.value = true;
    try {
        // In real app: API call to create/update alert
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (editingAlert.value) {
            // Update existing alert
            const index = alerts.value.findIndex(a => a.id === editingAlert.value!.id);
            if (index !== -1) {
                alerts.value[index] = {
                    ...alerts.value[index],
                    ...values,
                    updatedAt: new Date().toISOString()
                };
            }
            toast({ 
                title: 'Alert updated', 
                description: 'Alert has been updated successfully',
            });
        } else {
            // Create new alert
            alerts.value.unshift({
                id: Date.now(),
                ...values,
                createdAt: new Date().toISOString(),
                isActive: true,
            });
            toast({ 
                title: 'Alert created', 
                description: 'New alert has been created successfully',
            });
        }
        
        closeAlertDialog();
    } catch (e) {
        console.error('Error with alert:', e);
        toast({ 
            title: 'Error', 
            description: 'Failed to save alert', 
            variant: 'destructive' 
        });
    } finally {
        isCreatingAlert.value = false;
    }
});

const deleteAlert = async (alertId: number) => {
    if (!isAdmin.value) return;
    
    try {
        // In real app: await axios.delete(`${environment.apiUrl}/api/alerts/${alertId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        
        alerts.value = alerts.value.filter(alert => alert.id !== alertId);
        toast({ 
            title: 'Alert deleted', 
            description: 'Alert has been removed successfully',
        });
    } catch (e) {
        console.error('Error deleting alert:', e);
        toast({ 
            title: 'Error', 
            description: 'Failed to delete alert', 
            variant: 'destructive' 
        });
    }
};

const toggleAlertStatus = async (alertId: number) => {
    if (!isAdmin.value) return;
    
    try {
        const alert = alerts.value.find(a => a.id === alertId);
        if (alert) {
            alert.isActive = !alert.isActive;
            alert.updatedAt = new Date().toISOString();
            
            toast({ 
                title: alert.isActive ? 'Alert activated' : 'Alert deactivated', 
                description: `Alert has been ${alert.isActive ? 'activated' : 'deactivated'}`,
            });
        }
    } catch (e) {
        console.error('Error toggling alert:', e);
        toast({ 
            title: 'Error', 
            description: 'Failed to update alert status', 
            variant: 'destructive' 
        });
    }
};

const getAlertIcon = (type: AlertType) => {
    switch (type) {
        case 'critical': return AlertTriangleIcon;
        case 'warning': return AlertTriangleIcon;
        case 'info': return InfoIcon;
        default: return InfoIcon;
    }
};

const getRoleIcon = () => {
    return isAdmin.value ? ShieldIcon : UserIcon;
};

const getRoleBadgeVariant = () => {
    return isAdmin.value ? 'default' : 'secondary';
};
</script>

<template>
  <div class="min-h-screen bg-background p-4">
    <div class="w-full max-w-4xl mx-auto animate-fade-in space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <NavBar />
      </div>

      <!-- User Information Card -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <UserIcon class="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>Your personal account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="isLoading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p class="mt-2 text-muted-foreground">Loading...</p>
          </div>
          <div v-else-if="user" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label class="text-sm font-medium">Username</Label>
              <Input :model-value="user.username || 'Not available'" class="bg-muted/50" disabled />
            </div>
            <div class="space-y-2">
              <Label class="text-sm font-medium">Email</Label>
              <Input :model-value="user.email || 'Not available'" class="bg-muted/50" disabled />
            </div>
            <div class="space-y-2">
              <Label class="text-sm font-medium">First Name</Label>
              <Input :model-value="user.first_name || 'Not available'" class="bg-muted/50" disabled />
            </div>
            <div class="space-y-2">
              <Label class="text-sm font-medium">Last Name</Label>
              <Input :model-value="user.last_name || 'Not available'" class="bg-muted/50" disabled />
            </div>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-muted-foreground">No user data available</p>
          </div>
        </CardContent>
      </Card>

      <!-- Admin: Threshold Settings -->
      <Card v-if="isAdmin" class="border-orange-200 dark:border-orange-900">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <SettingsIcon class="h-5 w-5" />
            Environmental Thresholds
          </CardTitle>
          <CardDescription>Configure alert thresholds for environmental monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="saveThresholds" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label>Air Quality Index (AQI)</Label>
                <Input 
                  v-model.number="newThresholds.airQuality" 
                  type="number" 
                  min="0" 
                  max="500" 
                  placeholder="Enter AQI threshold"
                />
                <p class="text-xs text-muted-foreground">Values above this will trigger alerts</p>
              </div>
              <div class="space-y-2">
                <Label>Traffic Congestion (%)</Label>
                <Input 
                  v-model.number="newThresholds.traffic" 
                  type="number" 
                  min="0" 
                  max="100" 
                  placeholder="Enter traffic threshold"
                />
                <p class="text-xs text-muted-foreground">Percentage of traffic capacity</p>
              </div>
              <div class="space-y-2">
                <Label>Noise Level (dB)</Label>
                <Input 
                  v-model.number="newThresholds.noise" 
                  type="number" 
                  min="0" 
                  max="120" 
                  placeholder="Enter noise threshold"
                />
                <p class="text-xs text-muted-foreground">Decibel level for noise alerts</p>
              </div>
              <div class="space-y-2">
                <Label>Temperature (°C)</Label>
                <Input 
                  v-model.number="newThresholds.temperature" 
                  type="number" 
                  min="-20" 
                  max="50" 
                  placeholder="Enter temperature threshold"
                />
                <p class="text-xs text-muted-foreground">Maximum temperature for alerts</p>
              </div>
            </div>
            <Button type="submit" :disabled="isSavingThresholds" class="w-full md:w-auto">
              <div v-if="isSavingThresholds" class="flex items-center gap-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </div>
              <span v-else>Save Threshold Settings</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      <!-- Alert Management -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="flex items-center gap-2">
                <BellIcon class="h-5 w-5" />
                Alert Management
              </CardTitle>
              <CardDescription>
                {{ isAdmin ? 'Create, edit, and manage system alerts' : 'View recent system alerts' }}
              </CardDescription>
            </div>
            <Dialog v-if="isAdmin" v-model:open="isDialogOpen">
              <DialogTrigger as-child>
                <Button @click="openAlertDialog()" class="flex items-center gap-2">
                  <PlusIcon class="h-4 w-4" />
                  Create Alert
                </Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {{ editingAlert ? 'Edit Alert' : 'Create New Alert' }}
                  </DialogTitle>
                </DialogHeader>
                <form @submit.prevent="onAlertSubmit" class="space-y-4">
                  <div class="space-y-2">
                    <Label>Alert Type</Label>
                    <Select :model-value="alertValues.type" @update:model-value="(value) => setAlertFieldValue('type', value as AlertType)">
                      <SelectTrigger>
                        <SelectValue placeholder="Select alert type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <p v-if="alertErrors.type" class="text-sm text-destructive">{{ alertErrors.type }}</p>
                  </div>
                  <div class="space-y-2">
                    <Label>Message</Label>
                    <Input 
                      :value="alertValues.message" 
                      @input="setAlertFieldValue('message', $event.target.value)"
                      placeholder="Enter alert message" 
                    />
                    <p v-if="alertErrors.message" class="text-sm text-destructive">{{ alertErrors.message }}</p>
                  </div>
                  <div class="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" @click="closeAlertDialog">
                      Cancel
                    </Button>
                    <Button type="submit" :disabled="isCreatingAlert">
                      <div v-if="isCreatingAlert" class="flex items-center gap-2">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {{ editingAlert ? 'Updating...' : 'Creating...' }}
                      </div>
                      <span v-else>{{ editingAlert ? 'Update Alert' : 'Create Alert' }}</span>
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div v-if="alerts.length === 0" class="text-center py-8">
            <BellIcon class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p class="text-muted-foreground">No alerts found</p>
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="alert in alerts" 
              :key="alert.id" 
              class="flex items-start justify-between p-4 rounded-lg border transition-colors hover:bg-muted/50"
              :class="{
                'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20': alert.type === 'critical' && alert.isActive,
                'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20': alert.type === 'warning' && alert.isActive,
                'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20': alert.type === 'info' && alert.isActive,
                'opacity-60': !alert.isActive
              }"
            >
              <div class="flex items-start gap-3 flex-1">
                <component 
                  :is="getAlertIcon(alert.type)" 
                  class="h-5 w-5 mt-0.5 flex-shrink-0"
                  :class="{
                    'text-red-600 dark:text-red-400': alert.type === 'critical',
                    'text-orange-600 dark:text-orange-400': alert.type === 'warning',
                    'text-blue-600 dark:text-blue-400': alert.type === 'info'
                  }"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <Badge 
                      :variant="alert.type === 'critical' ? 'destructive' : 'default'"
                      class="text-xs"
                    >
                      {{ alert.type.toUpperCase() }}
                    </Badge>
                    <Badge v-if="!alert.isActive" variant="secondary" class="text-xs">
                      INACTIVE
                    </Badge>
                  </div>
                  <p class="text-sm font-medium mb-1">{{ alert.message }}</p>
                  <p class="text-xs text-muted-foreground">
                    Created: {{ new Date(alert.createdAt).toLocaleString() }}
                    <span v-if="alert.updatedAt" class="ml-2">
                      • Updated: {{ new Date(alert.updatedAt).toLocaleString() }}
                    </span>
                  </p>
                </div>
              </div>
              <div v-if="isAdmin" class="flex items-center gap-1 ml-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  @click="openAlertDialog(alert)"
                  class="h-8 w-8 p-0"
                >
                  <EditIcon class="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  @click="toggleAlertStatus(alert.id)"
                  class="h-8 w-8 p-0"
                  :class="{
                    'text-green-600 hover:text-green-700': !alert.isActive,
                    'text-orange-600 hover:text-orange-700': alert.isActive
                  }"
                >
                  <CheckCircleIcon v-if="!alert.isActive" class="h-4 w-4" />
                  <AlertTriangleIcon v-else class="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger as-child>
                    <Button variant="ghost" size="sm" class="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                      <Trash2Icon class="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Alert</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this alert? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        @click="deleteAlert(alert.id)"
                        class="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
