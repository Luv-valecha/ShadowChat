# ShadowChat

ShadowChat is a real-time chat application designed for secure and seamless communication. Built using modern web technologies, it provides an intuitive user experience with end-to-end encryption.

## Features

- 🟢 **Real-time Messaging** - Chat with users instantly.
- 🔒 **End-to-End Encryption** - Ensures privacy and security.
- 🎨 **User-Friendly Interface** - Minimalistic and easy to navigate.
- 📂 **Media Support** - Send and receive images, videos, and documents.
- 🌍 **Online Status** - See when users are active.
- 🔔 **Notifications** - Get alerts for new messages.

## Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-time Communication:** Socket.io
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
3. Enjoy real-time chat with instant notifications!

## Deployment

The application is deployed on [Render](https://shadowchat-iupa.onrender.com/).

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
