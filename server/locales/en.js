// @ts-check

export default {
  translation: {
    appName: 'Task Manager',

    flash: {
      session: {
        create: {
          success: 'You are logged in',
          error: 'Incorrect email or password',
        },
        delete: {
          success: 'You are logged out',
        },
      },

      users: {
        accessDenied: 'Access denied! Please log in.',
        create: {
          success: 'User registered successfully',
          error: 'Failed to register',
        },
        update: {
          success: 'User successfully changed',
          error: 'Failed to change user',
        },
        delete: {
          success: 'User successfully deleted',
          error: 'You cannot edit or delete another user.',
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

      labels: {
        new: {
          header: '',
          submit: '',
        },
        create: {
          success: 'The label was successfully created',
          error: 'Failed to create label',
        },
        update: {
          success: 'The label has been changed successfully',
          error: '',
        },
        delete: {
          success: 'The tag has been successfully removed',
          error: '',
        },
      },

      tasks: {
        created: 'Task successfully created',
        updated: 'Task updated successfully',
        deleted: 'Task deleted successfully',
        error: 'Error processing task',
        deleteDenied: 'A task can only be deleted by its author',
        name: 'Name',
        status: 'Status',
        creator: 'Creator',
        executor: 'Executor',
      },

      authError: 'Access denied! Please log in.',
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
        signIn: 'Entrance',
        email: 'Email',
        password: 'Password',
        login: 'Login',
      },
      users: {
        index: {
          id: 'ID',
          fullName: 'fullName',
          email: 'Email',
          createdAt: 'Created at',
          actions: 'Actions',
        },
        action: {
          edit: 'Change',
          delete: 'Delete',
        },
        new: {
          signUp: 'Registration',
          firstname: 'First name',
          lastname: 'Last name',
          email: 'Email',
          password: 'Password',
          submit: 'Save',
        },
        edit: {
          editProfile: 'Change user',
          firstname: 'First name',
          lastname: 'Last name',
          email: 'Email',
          password: 'Password',
          submit: 'Сhange',
        },
      },

      welcome: {
        index: {
          hello: 'Hello!',
          description: 'Online programming school',
          more: 'Learn more',
        },
      },

      statuses: {
        index: {
          header: 'Statuses',
          new: 'Create status',
          id: 'ID',
          name: 'Name',
          createdAt: 'Created at',
          edit: 'Change',
          delete: 'Delete',
          actions: 'Actions',
        },
        new: {
          header: 'Create a status',
          name: 'Name',
          create: 'Create',
        },
        edit: {
          header: 'Change of status',
          name: 'Name',
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
          executor: 'Executor',
          createdAt: 'Date of creation',
          actions: 'Actions',
          labels: 'Labels',
        },

        action: {
          new: 'Create task',
          show: 'Show',
          edit: 'Change',
          delete: 'Delete',
        },

        new: {
          title: 'Creating a task',
          submit: 'Create',
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
          all: '',
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
