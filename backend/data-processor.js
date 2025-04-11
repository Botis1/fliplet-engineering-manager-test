  // Mock API to fetch missing data
  async function fetchUserData(id) {
    return { email: `user${id}@email.com` };
  }
  
  // Optimize this function:
  async function processUsers(users) {
    const usedEmails = new Set();
    const results = [];
    const fetchPromises = [];
    const usersWithoutEmail = [];
    
    // First pass: process users with emails and identify those needing fetch
    for (const user of users) {
      if (user.email) {
        if (!usedEmails.has(user.email)) {
          usedEmails.add(user.email);
          results.push({ ...user });
        }
      } else {
        usersWithoutEmail.push({ index: usersWithoutEmail.length, user: { ...user } });
        fetchPromises.push(fetchUserData(user.id));
      }
    }
    
    // Batch fetch all missing emails
    if (fetchPromises.length > 0) {
      const enrichedData = await Promise.all(fetchPromises);
      
      // Process users with fetched emails
      for (let i = 0; i < enrichedData.length; i++) {
        const { user } = usersWithoutEmail[i];
        user.email = enrichedData[i].email;
        
        if (!usedEmails.has(user.email)) {
          usedEmails.add(user.email);
          results.push(user);
        }
      }
    }
    
    return results;
  }
  
  module.exports = processUsers;