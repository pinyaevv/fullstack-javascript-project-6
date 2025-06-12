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
        new: {
          header: 'Create new status',
          submit: 'Send',
        },
        create: {
          success: 'Status created successfully',
          error: 'Error creating status',
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
        tasks: 'Tasks',
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
    statuses: {
      index: {
        id: 'ID',
        header: 'Statuses',
        new: 'Create status',
        name: 'Name',
        createdAt: 'Created at',
        edit: 'Change',
        delete: 'Delete',
        confirm: 'Are you sure you want to delete this status?',
      },
    },

    tasks: {
      index: {
        title: 'Tasks',
        new: 'Create task',
        id: 'ID',
        name: 'Name',
        status: 'Status',
        creator: 'Creator',
        createdAt: 'Created at',
        edit: 'Edit',
        delete: 'Delete',
        confirm: 'Are you sure you want to delete this task?',
      },
      new: {
        title: 'New Task',
        submit: 'Create task',
        form: {
          name: 'Name',
          description: 'Description',
          status: 'Status',
        },
      },
      edit: {
        title: 'Edit Task',
        submit: 'Save changes',
        form: {
          name: 'Name',
          description: 'Description',
          status: 'Status',
        },
      },
      show: {
        title: 'Task details',
        name: 'Name',
        description: 'Description',
        status: 'Status',
        creator: 'Creator',
        createdAt: 'Created at',
        edit: 'Edit',
      },
    },

  },
};
