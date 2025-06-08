// @ts-check

export default {
  translation: {
    appName: 'Task Manager',
    flash: {
      session: {
        create: {
          success: 'You are logged in',
          error: 'Wrong email or password',
        },
        delete: {
          success: 'You are logged out',
        },
      },
      users: {
        accessDenied: 'Access denied',
        create: {
          error: 'Failed to register',
          success: 'User registered successfully',
        },
        update: {
          error: 'Error updating data',
          success: 'User data updated successfully',
        },
        delete: {
          success: 'User successfully deleted',
        },
      },
      statuses: {
        create: {
          success: 'Status created successfull',
          error: 'Error creating status',
        },
        edit: {
          notFound: 'Status not found',
        },
        update: {
          success: 'Status updated successfully',
          error: 'Error updating status',
        },
        delete: {
          success: 'Status deleted successfully',
          error: 'Error deleting status',
        },
      },
      authError: 'Access denied! Please login',
    },
    layouts: {
      application: {
        users: 'Users',
        signIn: 'Login',
        signUp: 'Register',
        signOut: 'Logout',
        statuses: 'Statuses',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Login',
          submit: 'Login',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        createdAt: 'Created at',
        new: {
          submit: 'Register',
          signUp: 'Register',
        },
        edit: {
          editProfile: 'Edit profile',
          submit: 'Save',
        },
      },
      welcome: {
        index: {
          hello: 'Hello from Hexlet!',
          description: 'Online programming school',
          more: 'Learn more',
        },
      },
      cover: {
        title: 'Task Manager',
        description: 'Organize your tasks effectively and stress-free.',
        getStarted: 'Get Started',
      },
    },
  },
};
