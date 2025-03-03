import { ref, onMounted, onBeforeUnmount } from 'vue';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const isMobile = ref(false);
  
  // Handler function for media query changes
  const onChange = () => {
    isMobile.value = window.innerWidth < MOBILE_BREAKPOINT;
  };
  
  onMounted(() => {
    // Create media query list for mobile breakpoint
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Add event listener for changes
    mql.addEventListener('change', onChange);
    
    // Initialize value based on current window width
    isMobile.value = window.innerWidth < MOBILE_BREAKPOINT;
  });
  
  onBeforeUnmount(() => {
    // Clean up event listener when component is unmounted
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mql.removeEventListener('change', onChange);
  });
  
  return isMobile;
}