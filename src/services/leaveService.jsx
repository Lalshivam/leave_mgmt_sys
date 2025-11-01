const STORAGE_KEY = 'lms_leaves_v1';        //versioned key

// Helper functions to read and write leave data from/to localStorage
function read() {
  const raw = localStorage.getItem(STORAGE_KEY);              //versioned key
  try { return raw ? JSON.parse(raw) : []; } catch { return []; }     //in case of malformed data
}

// Helper function to write leave data to localStorage
function write(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));      //versioned key
}

// Helper function to generate a unique ID for each leave application
function uid() {
  return Math.random().toString(36).substring(2, 9);       //simple unique id
}

// The leaveService object encapsulates all leave-related operations
export const leaveService = {
  applyLeave(leaveData) {
    const leaves = read();                      // Read existing leaves
    const id = uid();                           // Generate a unique ID for the new leave application
    leaves.unshift({ ...leaveData, id });       // Add the new leave application to the list
    write(leaves);                              // Write the updated list back to localStorage
    return Promise.resolve({ ok: true, id });   // Return a resolved promise with success status and the new ID
  },

  // Fetch leaves for a specific user
  getLeavesByUser(username) {                             
    return read().filter((l) => l.username === username);     // Filter leaves by username
  },

  // Fetch all leave applications (for admin)
  getAllLeaves() {
    return read();           // Return all leave applications
  },

  // Admin function to set the status of a leave application
  adminSetStatus(id,status){
    const leaves = read();                            // Read existing leaves
    const idx = leaves.findIndex((l)=>l.id === id);   // Find the index of the leave application by ID
    if(idx !== -1){                                   // If found
      leaves[idx].status = status;                    // Update the status
      write(leaves);                                  // Write the updated list back to localStorage
      return Promise.resolve({ ok: true });           // Return a resolved promise with success status
    }
    return Promise.reject(new Error('Leave application not found')); // If not found, return a rejected promise with an error
  },

  // Calculate remaining leave balance for a user
  getLeaveBalance(username){
    const Start = 20;          // Starting leave balance
    const leaves = read();        // Read existing leaves
    const approvedDays = leaves.filter((l) => l.username == username && l.status === 'approved').reduce((s,r) => s + (r.days || 0), 0); //Sum approved leave days
    return Start - approvedDays;                     // Return remaining leave balance
  },

  // Utility function to calculate the number of days between two dates
  calculateDays(startDate, endDate) {
    const s = new Date(startDate);             
    const e = new Date(endDate);
    const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1; // Calculate difference in days
    return diff > 0 ? diff : 0;
  }
};