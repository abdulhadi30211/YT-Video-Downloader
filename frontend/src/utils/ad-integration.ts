// Adsterra Smartlink Integration Utility
const SMARTLINK_URL = 'https://www.effectivegatecpm.com/wgw2bhr5?key=1b385f4947f7f8578444f5eb78ac6523';

/**
 * Opens the Adsterra smartlink in a new tab and executes the original action
 * @param originalAction The original button action to perform
 * @returns Promise that resolves when both actions are initiated
 */
export const withSmartlink = async (originalAction: () => void | Promise<void>): Promise<void> => {
  // Open the smartlink in a new tab first
  const smartlinkTab = window.open(SMARTLINK_URL, '_blank');
  
  // If popup is blocked, show a message to the user
  if (!smartlinkTab) {
    console.warn('Adsterra smartlink popup was blocked. Please allow popups for this site.');
  }
  
  // Execute the original action in the current tab
  try {
    await originalAction();
  } catch (error) {
    console.error('Error in original action:', error);
  }
};

/**
 * React hook to wrap button click handlers with smartlink functionality
 * @param callback The original callback function
 * @returns Wrapped callback function with smartlink integration
 */
export const useSmartlink = (callback: () => void | Promise<void>) => {
  return () => withSmartlink(callback);
};