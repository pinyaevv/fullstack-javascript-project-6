// @ts-check

export default {
  translation: {
    appName: 'Менеджер задач',

    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },

      users: {
        accessDenied: 'Доступ запрещён! Пожалуйста, войдите.',
        create: {
          success: 'Пользователь успешно зарегистрирован',
          error: 'Не удалось зарегистрировать',
        },
        update: {
          success: 'Пользователь успешно изменён',
          error: 'Не удалось изменить пользователя',
        },
        delete: {
          success: 'Пользователь успешно удалён',
          error: 'Вы не можете редактировать или удалять другого пользователя.',
        },
      },

      statuses: {
        new: {
          header: 'Создать новый статус',
          submit: 'Отправить',
        },
        create: {
          success: 'Статус успешно создан',
          error: 'Не удалось создать статус',
        },
        update: {
          success: 'Статус успешно изменён',
          error: 'Ошибка при обновлении статуса',
        },
        delete: {
          success: 'Статус успешно удалён',
          error: 'Ошибка при удалении статуса',
        },
      },

      labels: {
        new: {
          header: '',
          submit: '',
        },
        create: {
          success: 'Метка успешно создана',
          error: 'Не удалось создать метку',
        },
        update: {
          success: 'Метка успешно изменена',
          error: '',
        },
        delete: {
          success: 'Метка успешно удалена',
          error: '',
        },
      },

      tasks: {
        created: 'Задача успешно создана',
        updated: 'Задача успешно обновлена',
        deleted: 'Задача успешно удалена',
        error: 'Не удалось создать задачу',
        deleteDenied: 'Задачу может удалить только её автор',
      },

      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },

    layouts: {
      application: {
        users: 'Пользователи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        statuses: 'Статусы',
        tasks: 'Задачи',
        labels: 'Метки',
      },
    },

    views: {
      session: {
        signIn: 'Вход',
        email: 'Email',
        password: 'Пароль',
        login: 'Войти',
      },
      users: {
        index: {
          id: 'ID',
          fullName: 'Полное имя',
          email: 'Email',
          createdAt: 'Дата создания',
          actions: 'Действия',
        },
        action: {
          edit: 'Изменить',
          delete: 'Удалить',
        },
        new: {
          signUp: 'Регистрация',
          firstname: 'Имя',
          lastname: 'Фамилия',
          email: 'Email',
          password: 'Пароль',
          submit: 'Сохранить',
        },
        edit: {
          editProfile: 'Изменение пользователя',
          firstname: 'Имя',
          lastname: 'Фамилия',
          email: 'Email',
          password: 'Пароль',
          submit: 'Изменить',
        },
      },

      welcome: {
        index: {
          hello: 'Привет!',
          description: 'Онлайн школа программирования',
          more: 'Узнать больше',
        },
      },

      statuses: {
        index: {
          header: 'Статусы',
          new: 'Создать статус',
          id: 'ID',
          name: 'Имя',
          createdAt: 'Дата создания',
          edit: 'Изменить',
          delete: 'Удалить',
          actions: 'Действия',
        },
        new: {
          header: 'Создание статуса',
          name: 'Наименование',
          create: 'Создать',
        },
        edit: {
          header: 'Изменение статуса',
          name: 'Наименование',
          submit: 'Изменить',
        },
      },

      tasks: {
        index: {
          title: 'Задачи',
          id: 'ID',
          name: 'Имя',
          status: 'Статус',
          creator: 'Автор',
          executor: 'Исполнитель',
          createdAt: 'Дата создания',
          actions: 'Действия',
          labels: 'Метки',
        },

        filter: {
          status: 'Статус',
          executor: 'Исполнитель',
          label: 'Метка',
          myTasksOnly: 'Только мои задачи',
          all: '',
        },

        action: {
          new: 'Создать задачу',
          show: 'Показать',
          edit: 'Изменить',
          delete: 'Удалить',
        },

        new: {
          title: 'Создание задачи',
          submit: 'Создать',
          form: {
            name: 'Наименование',
            description: 'Описание',
            status: 'Статус',
            selectStatus: '',
            executor: 'Исполнитель',
            selectExecutor: '',
          },
        },

        edit: {
          title: 'Изменение задачи',
          form: {
            name: 'Имя',
            description: 'Описание',
            status: 'Статус',
            selectStatus: 'Выберите статус',
            executor: 'Исполнитель',
            selectExecutor: 'Выберите исполнителя',
            labels: 'Метки',
          },
        },

        show: {
          labels: 'Метки',
          status: 'Статус',
          description: 'Описание',
          executor: 'Исполнитель',
          creator: 'Автор',
          createdAt: 'Дата создания',
          edit: 'Изменить',
          delete: 'Удалить',
        },
      },

      labels: {
        index: {
          header: 'Метки',
          id: 'ID',
          name: 'Имя',
          createdAt: 'Дата создания',
          action: 'Действие',
          new: 'Создать метку',
          edit: 'Изменить',
          delete: 'Удалить',
          empty: 'Пусто',
        },
        actions: {
          edit: 'Изменить',
          delete: 'Удалить',
          create: 'Создать',
          change: 'Изменить',
        },
        new: {
          createLabel: 'Создание метки',
          name: 'Наименование',
        },
        edit: {
          header: 'Изменение метки',
        },
      },
    },
  },
};
