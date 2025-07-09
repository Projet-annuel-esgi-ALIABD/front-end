<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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
import { Checkbox } from '@/components/ui/checkbox';
import NavBar from '@/components/navbar.vue';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UserIcon, SettingsIcon, BellIcon, PlusIcon, Trash2Icon, EditIcon, AlertTriangleIcon, InfoIcon } from 'lucide-vue-next';
import environment from '@/environment/environment';
import axios from 'axios';

type AlertType = 'info' | 'warning' | 'critical';

interface Alert {
    id: number;
    type: AlertType;
    message: string;
    createdAt: string;
    updatedAt?: string;
}

interface Threshold {
    id: number;
    threshold_value: number;
    active: boolean;
    indicator: string;
}

const { toast } = useToast();

const user = ref<any>(null);
const isAdmin = computed(() => user.value?.role === 'admin');
const isLoading = ref(true);
const isSavingThresholds = ref(false);
const isCreatingAlert = ref(false);

// Threshold settings
const thresholds = ref<Threshold[]>([]);
const editingThreshold = ref<Threshold | null>(null);
const isThresholdDialogOpen = ref(false);

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

// Threshold form validation schema
const thresholdSchema = z.object({
    indicator: z.string().min(1, 'Indicator is required'),
    threshold_value: z.number().min(0, 'Threshold value must be positive'),
    active: z.boolean()
});

// Setup alert form
const { handleSubmit: handleAlertSubmit, errors: alertErrors, values: alertValues, setFieldValue: setAlertFieldValue, resetForm } = useForm({
    validationSchema: toTypedSchema(alertSchema),
    initialValues: {
        type: 'info' as AlertType,
        message: ''
    }
});

// Setup threshold form
const { handleSubmit: handleThresholdSubmit, errors: thresholdErrors, values: thresholdValues, setFieldValue: setThresholdFieldValue, resetForm: resetThresholdForm } = useForm({
    validationSchema: toTypedSchema(thresholdSchema),
    initialValues: {
        indicator: '',
        threshold_value: 0,
        active: true
    }
});

onMounted(async () => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await axios.get(`${environment.apiUrl}/api/user/`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(response => {
                    user.value = response.data;
                    user.value.role = user.value.is_staff ? 'admin' : 'admin';
                });
            } catch (error) {
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

        await axios.get(`${environment.apiUrl}/api/alerte/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(response => {
            const data = response.data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            data.map((item: any) => {
                alerts.value.push({
                    id: item.id,
                    type: item.alert_type,
                    message: item.message,
                    createdAt: item.created_at
                });
            });
            isLoading.value = false;
        });

        await axios.get(`${environment.apiUrl}/api/alert-treshold/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(response => {
            thresholds.value = response.data;
        });
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

const openThresholdDialog = (threshold?: Threshold) => {
    if (threshold) {
        editingThreshold.value = threshold;
        setThresholdFieldValue('indicator', threshold.indicator);
        setThresholdFieldValue('threshold_value', threshold.threshold_value);
        setThresholdFieldValue('active', true);
    } else {
        editingThreshold.value = null;
        resetThresholdForm();
    }
    isThresholdDialogOpen.value = true;
};

const closeThresholdDialog = () => {
    isThresholdDialogOpen.value = false;
    editingThreshold.value = null;
    resetThresholdForm();
};

const onThresholdSubmit = handleThresholdSubmit(async (values) => {
    if (!isAdmin.value) return;
    
    isSavingThresholds.value = true;
    try {
        if (editingThreshold.value) {
            // Update existing threshold
            await axios.post(`${environment.apiUrl}/api/alert-treshold/`, values, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const index = thresholds.value.findIndex(t => t.id === editingThreshold.value!.id);
            if (index !== -1) {
                thresholds.value[index] = { ...editingThreshold.value, ...values };
            }
            toast({ 
                title: 'Threshold updated', 
                description: 'Threshold has been updated successfully',
            });
        } else {
            // Create new threshold
            const response = await axios.post(`${environment.apiUrl}/api/alert-treshold/`, values, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            thresholds.value.push(response.data);
            toast({ 
                title: 'Threshold created', 
                description: 'New threshold has been created successfully',
            });
        }
        
        closeThresholdDialog();
    } catch (e) {
        console.error('Error with threshold:', e);
        toast({ 
            title: 'Error', 
            description: 'Failed to save threshold', 
            variant: 'destructive' 
        });
    } finally {
        isSavingThresholds.value = false;
    }
});

const deleteThreshold = async (thresholdId: number) => {
    if (!isAdmin.value) return;
    
    try {
        await axios.delete(`${environment.apiUrl}/api/alert-treshold/${thresholdId}/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        thresholds.value = thresholds.value.filter(threshold => threshold.id !== thresholdId);
        toast({ 
            title: 'Threshold deleted', 
            description: 'Threshold has been removed successfully',
        });
    } catch (e) {
        console.error('Error deleting threshold:', e);
        toast({ 
            title: 'Error', 
            description: 'Failed to delete threshold', 
            variant: 'destructive' 
        });
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
        
        if (editingAlert.value) {
            // Update existing alert
            await axios.patch(`${environment.apiUrl}/api/alerte/${editingAlert.value.id}/`, {
                alert_type: values.type,
                message: values.message,
                triggered_by: "admin"
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
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
            await axios.post(`${environment.apiUrl}/api/alerte/`, {
                alert_type: values.type,
                message: values.message,
                triggered_by: "admin"
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alerts.value.unshift({
                id: Date.now(),
                ...values,
                createdAt: new Date().toISOString(),
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
    
    try {            await axios.delete(`${environment.apiUrl}/api/alerte/${alertId}/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
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

const getAlertIcon = (type: AlertType) => {
    switch (type) {
        case 'critical': return AlertTriangleIcon;
        case 'warning': return AlertTriangleIcon;
        case 'info': return InfoIcon;
        default: return InfoIcon;
    }
};

const getIndicatorLabel = (indicator: string) => {
    switch (indicator.toLowerCase()) {
        case 'co': return 'Carbon Monoxide (CO)';
        case 'no2': return 'Nitrogen Dioxide (NO2)';
        case 'o3': return 'Ozone (O3)';
        case 'pm25': return 'Fine Particles (PM2.5)';
        case 'pm10': return 'Coarse Particles (PM10)';
        case 'so2': return 'Sulfur Dioxide (SO2)';
        case 'aqi': return 'Air Quality Index';
        case 'temperature': return 'Temperature';
        case 'humidity': return 'Humidity';
        case 'pressure': return 'Atmospheric Pressure';
        default: return indicator.toUpperCase();
    }
};

const getIndicatorUnit = (indicator: string) => {
    switch (indicator.toLowerCase()) {
        case 'co': return 'ppm';
        case 'no2': return 'ppb';
        case 'o3': return 'ppb';
        case 'pm25': return 'μg/m³';
        case 'pm10': return 'μg/m³';
        case 'so2': return 'ppb';
        case 'aqi': return 'index';
        case 'temperature': return '°C';
        case 'humidity': return '%';
        case 'pressure': return 'hPa';
        default: return '';
    }
};

const getIndicatorOptions = () => [
    { value: 'co', label: 'Carbon Monoxide (CO)' },
    { value: 'no2', label: 'Nitrogen Dioxide (NO2)' },
    { value: 'no', label: 'Monoxyde d’azote (NO)' },
    { value: 'o3', label: 'Ozone (O3)' },
    { value: 'pm2_5', label: 'Fine Particles (PM2.5)' },
    { value: 'pm10', label: 'Coarse Particles (PM10)' },
    { value: 'so2', label: 'Sulfur Dioxide (SO2)' },
    { value: 'aqi', label: 'Air Quality Index' },
    { value: 'nh3  ', label: 'Ammoniac (NH3)' },
];
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
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <SettingsIcon class="h-5 w-5" />
                Environmental Thresholds
              </CardTitle>
              <CardDescription>Configure alert thresholds for environmental monitoring</CardDescription>
            </div>
            <Dialog v-model:open="isThresholdDialogOpen">
              <DialogTrigger as-child>
                <Button @click="openThresholdDialog()" class="flex items-center gap-2">
                  <PlusIcon class="h-4 w-4" />
                  Add Threshold
                </Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {{ editingThreshold ? 'Edit Threshold' : 'Add New Threshold' }}
                  </DialogTitle>
                </DialogHeader>
                <form @submit.prevent="onThresholdSubmit" class="space-y-4">
                  <div class="space-y-2">
                    <Label>Indicator</Label>
                    <Select :model-value="thresholdValues.indicator" @update:model-value="(value) => setThresholdFieldValue('indicator', value as string)">
                      <SelectTrigger>
                        <SelectValue placeholder="Select indicator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="option in getIndicatorOptions()" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p v-if="thresholdErrors.indicator" class="text-sm text-destructive">{{ thresholdErrors.indicator }}</p>
                  </div>
                  <div class="space-y-2">
                    <Label>Threshold Value</Label>
                    <Input 
                      :value="thresholdValues.threshold_value" 
                      @input="setThresholdFieldValue('threshold_value', Number($event.target.value))"
                      type="number" 
                      min="0" 
                      step="0.1"
                      placeholder="Enter threshold value"
                    />
                    <p v-if="thresholdErrors.threshold_value" class="text-sm text-destructive">{{ thresholdErrors.threshold_value }}</p>
                  </div>
                  <div class="flex  items-center gap-2 hidden">
                    <Checkbox 
                      :checked="thresholdValues.active" 
                      @update:checked="setThresholdFieldValue('active', $event)"
                    />
                    <Label>Active</Label>
                  </div>
                  <div class="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" @click="closeThresholdDialog">
                      Cancel
                    </Button>
                    <Button type="submit" :disabled="isSavingThresholds">
                      <div v-if="isSavingThresholds" class="flex items-center gap-2">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {{ editingThreshold ? 'Updating...' : 'Adding...' }}
                      </div>
                      <span v-else>{{ editingThreshold ? 'Update Threshold' : 'Add Threshold' }}</span>
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div v-if="thresholds.length === 0" class="text-center py-8">
            <SettingsIcon class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p class="text-muted-foreground">No thresholds configured</p>
            <p class="text-sm text-muted-foreground mt-2">Click "Add Threshold" to create your first threshold</p>
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="threshold in thresholds" 
              :key="threshold.id"
              class="flex items-center justify-between p-4 rounded-lg border transition-colors hover:bg-muted/50"
            >
              <div class="flex items-center gap-4 flex-1">
                <div class="flex items-center gap-2">
                  <Badge variant="outline" class="text-xs">
                    {{ threshold.indicator.toUpperCase() }}
                  </Badge>
                  <div 
                    class="w-3 h-3 rounded-full"
                    :class="threshold.active ? 'bg-green-500' : 'bg-gray-400'"
                  ></div>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <Label class="text-sm font-medium">{{ getIndicatorLabel(threshold.indicator) }}</Label>
                    <span class="text-sm text-muted-foreground">•</span>
                    <span class="text-sm font-mono">{{ threshold.threshold_value }} {{ getIndicatorUnit(threshold.indicator) }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-1 ml-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  @click="openThresholdDialog(threshold)"
                  class="h-8 w-8 p-0"
                >
                  <EditIcon class="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger as-child>
                    <Button variant="ghost" size="sm" class="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                      <Trash2Icon class="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Threshold</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this threshold for {{ getIndicatorLabel(threshold.indicator) }}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        @click="deleteThreshold(threshold.id)"
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
                'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20': alert.type === 'critical',
                'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20': alert.type === 'warning',
                'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20': alert.type === 'info',
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
