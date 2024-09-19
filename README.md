# BeConnected - Professional Networking Application

## Introduction
For this assignment, we developed a professional networking app named **BeConnected**, which is similar to LinkedIn. This project was completed as part of the **Internet Technologies and Applications** course at the **National and Kapodistrian University of Athens**.

The application supports two roles: **Administrator** and **Professional**. Administrators, assigned during installation, use their interface to manage users and export data. Professionals utilize their interface to manage their training and experience details, handle connections, and engage with their network. Key features for Professionals include:

- Sending and receiving connection requests
- Posting articles with images and videos
- Commenting on posts and expressing interest in content
- Receiving notifications
- Conducting private discussions
- Viewing other professionals' profiles and managing connection settings

## Architecture
BeConnected is built on a **client-server model**:

- **Server:** Developed with **Spring Boot** and **MySQL**, the server provides a RESTful API that supports various client applications.
- **Client:** The client-side of the application is designed using **React** and **JavaScript**, offering a user-friendly interface for easy interaction.

## Creators
BeConnected was developed by:

- [Evangelos Argyropoulos](https://github.com/Vaggelis-Arg)
- [Dimitrios Nikolaos Boutzounis](https://github.com/dboutzounis)

## Installation

### Clone the Repository
To begin with the installation, clone the repository using the following command:
```bash
git clone https://github.com/Vaggelis-Arg/beconnected.git
```

## Usage

Once the application is set up and running, you can access it through your web browser.

- **Administrators** should log in to manage users, view analytics, and export data.
  - Use the admin dashboard to oversee user activity and perform administrative tasks.
  - Navigate to the user management section to add, remove, or modify user accounts.
  - Access the data export feature to generate reports and download necessary data.

- **Professionals** can log in to manage their profiles, connect with others, post updates, and engage with their network.
  - Update your profile with training and experience details from the profile management section.
  - Send and receive connection requests through the network interface.
  - Post articles, images, and videos to share updates with your network.
  - Comment on posts, express interest in content, and participate in discussions.
  - Use the notification system to stay informed about new interactions and updates.
  - Manage your connection settings and privacy options from the settings menu.

After logging in, users will be directed to their respective dashboards based on their roles. Follow the on-screen instructions to explore and utilize the available features.
