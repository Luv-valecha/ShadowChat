# ShadowChat

ShadowChat is a real-time MERN Stack chat application designed for secure and seamless communication. Built using modern web technologies, it provides an intuitive user experience with collaborative code rooms and AI generated smart replies.

## Features

- 🟢 **Real-time Messaging** - Chat with users instantly.
- 🤖 **Smart Replies (powered by Google Gemini)** – Suggests smart responses to keep conversations flowing smoothly.
- 🎨 **User-Friendly Interface** - Minimalistic and easy to navigate.
- 📂 **Media Support** - Send and receive images.
- 🌍 **Online Status** - See when users are active.
- 🔐 **Role Based Access** - Admins have access to daily stats.
- 👥 **Collaborative Code Rooms** - Code rooms which different users can join and code together in real-time.

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, Daisy UI
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-time Communication and Code Rooms:** Socket.io
- **Deployment:** Render

## Installation

### Prerequisites
- Node.js (v16 or later)
- MongoDB (local or cloud instance)

### Setup

1. **Clone the Repository**
   ```sh
   git clone https://github.com/Luv-valecha/ShadowChat.git
   cd ShadowChat
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and configure the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SOCKET_PORT=5000
   ```

4. **Run the Server**
   ```sh
   npm run server
   ```

5. **Run the Frontend**
   ```sh
   cd client
   npm start
   ```

## Usage

1. Sign up or log in to your account.
2. Start a conversation with friends.
3. Enjoy real-time chat!

## Deployment

The application is deployed on [Render](https://shadowchat-iupa.onrender.com/).

## Documentation

The Project Report is uploaded in the github: [Project_Report](https://github.com/Luv-valecha/ShadowChat/blob/main/ShadowChat_Project_Report.pdf)

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature-branch`
5. Submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any issues or suggestions, feel free to contact [Luv Valecha](https://github.com/Luv-valecha).
