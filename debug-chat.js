// Debug script to test Firebase connection and create test data
// Run this with: node debug-chat.js

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc, collection, getDocs } = require('firebase/firestore');

// Your Firebase config - replace with your actual config
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function debugFirestore() {
  try {
    console.log('🔍 Checking Firestore connection...');
    
    // Test 1: Check if we can read from users collection
    console.log('\n📋 Checking users collection:');
    const usersSnapshot = await getDocs(collection(db, 'users'));
    console.log(`Found ${usersSnapshot.size} users:`);
    
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      console.log(`- ${userData.displayName} (${userData.email})`);
    });
    
    if (usersSnapshot.size === 0) {
      console.log('⚠️  No users found! You need to register some users first.');
      console.log('   1. Go to your app and register with different email addresses');
      console.log('   2. Use different display names for each user');
      console.log('   3. Then try searching for users');
    }
    
    // Test 2: Check userChats collection
    console.log('\n💬 Checking userChats collection:');
    const userChatsSnapshot = await getDocs(collection(db, 'userChats'));
    console.log(`Found ${userChatsSnapshot.size} userChat documents`);
    
    // Test 3: Check chats collection
    console.log('\n🗨️  Checking chats collection:');
    const chatsSnapshot = await getDocs(collection(db, 'chats'));
    console.log(`Found ${chatsSnapshot.size} chat documents`);
    
    console.log('\n✅ Firestore connection successful!');
    
  } catch (error) {
    console.error('❌ Error connecting to Firestore:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure your Firebase config is correct');
    console.log('2. Check your Firestore security rules');
    console.log('3. Ensure your project has Firestore enabled');
  }
}

// Uncomment and add your Firebase config to run this
// debugFirestore();

console.log('⚠️  Please add your Firebase config and uncomment the last line to run this debug script');
console.log('You can find your config in Firebase Console > Project Settings > General > Your apps');
