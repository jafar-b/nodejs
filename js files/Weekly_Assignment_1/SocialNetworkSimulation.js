// 6. Social Network Simulation
// Create a mini social network simulation using Node.js and Object-Oriented
// Programming principles. This is a backend-only, in-memory simulation — do not
// use any external libraries, databases, or file system.
// Functional Requirements:
// 1. User Functionality
// ● Create 10 users with randomly generated usernames.
// ● Each user should have:
// ○ id (auto-increment or UUID)
// ○ username
// 2. Post Functionality
// ● Each user can create 1 random post (total 10 posts).
// ● Each post should include:
// ○ id (auto-increment or UUID)
// ○ content (random sentence)
// ○ author (User object)
// ○ likes: array of User objects who liked the post
// ○ comments: array of Comment objects
// 3. Interaction Simulation
// ● Random users should:
// ○ Like random posts (not their own).
// ○ Comment on random posts (not their own).
// ● Comment structure:
// ○ id
// ○ commenter: User object
// ○ text: random comment string
// 4. Display Output
// ● Display the list of all users.
// ● For each user, show:
// ○ Their posts
// ○ Each post’s likes (usernames)
// ○ Each post’s comments (usernames + comment text)
// ○ createdAt

// Social Network Simulation

class User {
    constructor(id, username) {
      this.id = id;
      this.username = username;
    }
  }
  
  class Comment {
    constructor(id, commenter, text) {
      this.id = id;
      this.commenter = commenter;
      this.text = text;
    }
  }
  
  class Post {
    constructor(id, content, author) {
      this.id = id;
      this.content = content;
      this.author = author;
      this.likes = [];
      this.comments = [];
      this.createdAt = new Date();
    }
  
    addLike(user) {
      if (user.id !== this.author.id && !this.likes.includes(user)) {
        this.likes.push(user);
      }
    }
  
    addComment(comment) {
      if (comment.commenter.id !== this.author.id) {
        this.comments.push(comment);
      }
    }
  }
  
  // Sample data
  const usernames = ['raj', 'simran', 'arjun', 'neha', 'ravi', 'priya', 'aman', 'anita', 'vijay', 'kiran'];
  const postsText = ['Hello world!', 'Great day!', 'Love coding.', 'JS is fun!', 'Just chilling.', 'Weekend vibes.', 'College life rocks!', 'Feeling motivated.', 'New post!', 'Keep learning.'];
  const commentsText = ['Nice!', 'Awesome.', 'Cool post.', 'Agreed!', 'Well said.', 'True that!', 'Haha ', 'Interesting.', 'Good one!', '👌'];
  
  let users = [];
  let posts = [];
  let commentId = 1;
  
  // creating users
  usernames.forEach((name, i) => {
    users.push(new User(i + 1, name));
  });
  
  // creating posts
  users.forEach((user, i) => {
    const post = new Post(i + 1, postsText[i], user);
    posts.push(post);
  });
  
 // Adding likes and comments
posts.forEach(post => {
    // Add 3 likes from random users
    for (let i = 0; i < 3; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      post.addLike(randomUser);
    }
  
    // Add 2 comments from random users
    for (let i = 0; i < 2; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomComment = commentsText[Math.floor(Math.random() * commentsText.length)];
      const comment = new Comment(commentId++, randomUser, randomComment);
      post.addComment(comment);
    } 
  });

  // Display output
  users.forEach(user => {
    console.log(`\nUser: ${user.username}`);
    posts
      .filter(p => p.author.id === user.id)
      .forEach(post => {
        console.log(`  Post: "${post.content}"`);
        console.log(`  Created At: ${post.createdAt}`);
        console.log(`  Likes: ${post.likes.map(u => u.username).join(', ')}`);
        console.log(`  Comments:`);
        post.comments.forEach(c => {
          console.log(`    - ${c.commenter.username}: ${c.text}`);
        });
      });
  });
