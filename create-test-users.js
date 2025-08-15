// Test script to create some demo users for testing chat functionality
// Run this with: node create-test-users.js

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Your Firebase config (replace with your actual config)
const firebaseConfig = {
  // Add your Firebase config here
  // You can find this in your Firebase project settings
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const testUsers = [
  {
    displayName: "Alice Johnson",
    email: "alice@test.com",
    password: "password123",
    photoURL: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  {
    displayName: "Bob Smith",
    email: "bob@test.com", 
    password: "password123",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    displayName: "Carol Davis",
    email: "carol@test.com",
    password: "password123", 
    photoURL: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    displayName: "David Wilson",
    email: "david@test.com",
    password: "password123",
    photoURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    displayName: "Emma Brown",
    email: "emma@test.com",
    password: "password123",
    photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  }
];

async function createTestUsers() {
  console.log('Creating test users...');
  
  for (const user of testUsers) {
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      const firebaseUser = userCredential.user;
      
      // Update profile
      await updateProfile(firebaseUser, {
        displayName: user.displayName,
        photoURL: user.photoURL
      });
      
      // Create user document in Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        uid: firebaseUser.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      });
      
      // Create empty userChats document
      await setDoc(doc(db, "userChats", firebaseUser.uid), {});
      
      console.log(`✅ Created user: ${user.displayName}`);
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  User ${user.displayName} already exists`);
      } else {
        console.error(`❌ Error creating ${user.displayName}:`, error.message);
      }
    }
  }
  
  console.log('\n🎉 Test user creation complete!');
  console.log('\nYou can now:');
  console.log('1. Register with your own account');
  console.log('2. Search for users: Alice, Bob, Carol, David, Emma');
  console.log('3. Start chatting with them');
  console.log('\nTest user credentials:');
  testUsers.forEach(user => {
    console.log(`${user.displayName}: ${user.email} / ${user.password}`);
  });
}

// Uncomment the line below and add your Firebase config to run this script
// createTestUsers();

console.log('⚠️  Please add your Firebase config and uncomment the last line to run this script');
