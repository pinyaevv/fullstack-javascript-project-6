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

      tasks: {
        create: 'Task created successfully',
        updated: 'Task updated successfully',
        deleted: 'Task deleted successfully',
        error: 'Error processing task',
        deleteDenied: 'You cannot delete this task',
        name: 'Name',
        status: 'Status',
        creator: 'Creator',
        executor: 'Executor',
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
        labels: 'Labels',
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
          hello: 'Hello!',
          description: 'Online programming school',
          more: 'Learn more',
        },
      },

      cover: {
        title: 'Task Manager',
        description: 'Organize your tasks effectively and stress-free.',
        getStarted: 'Get Started',
      },

      statuses: {
        index: {
          id: 'ID',
          header: 'Statuses',
          new: 'Create',
          name: 'Name',
          createdAt: 'Created at',
          edit: 'Change',
          delete: 'Delete',
        },
        edit: {
          header: 'Change of status',
          submit: 'Сhange',
        },
      },

      tasks: {
        index: {
          title: 'Tasks',
          id: 'ID',
          name: 'Name',
          status: 'Status',
          creator: 'Creator',
          createdAt: 'Date of creation',
        },

        action: {
          new: 'Create task',
          show: 'Show',
          edit: 'Change',
          delete: 'Delete',
        },

        new: {
          title: 'New Task',
          submit: 'Create task',
          form: {
            name: 'Name',
            description: 'Description',
            status: 'Status',
            selectStatus: '',
            executor: 'Executor',
            selectExecutor: '',
          },
        },

        edit: {
          title: 'Changing a task',
          form: {
            name: 'Name',
            description: 'Description',
            status: 'Status',
            selectStatus: 'Select status',
            executor: 'Executor',
            selectExecutor: 'Select executor',
            labels: 'Labels',
          },
        },

        filter: {
          status: 'Status',
          executor: 'Executor',
          label: 'Label',
          myTasksOnly: 'Just my tasks',
          all: 'Creator',
        },
      },

      labels: {
        index: {
          header: 'Labels',
          id: 'ID',
          name: 'Name',
          createdAt: 'Date of creation',
          new: 'Create label',
          edit: 'Change',
          delete: 'Delete',
          empty: 'Empty',
        },
        actions: {
          edit: 'Change',
          delete: 'Delete',
          create: 'Create',
          change: 'Change',
        },
        new: {
          createLabel: 'Creating a label',
        },
        edit: {
          header: 'Change label',
        },
      },
    },
  },
};
