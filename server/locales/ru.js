// @ts-check

export default {
  translation: {
    appName: 'Менеджер задач',
    flash: {
      session: {
        create: {
          success: 'Вы вошли в систему',
          error: 'Неправильный email или пароль',
        },
        delete: {
          success: 'Вы вышли из системы',
        },
      },
      users: {
        accessDenied: 'Доступ запрещён',
        create: {
          error: 'Ошибка при регистрации',
          success: 'Пользователь успешно зарегистрирован',
        },
        update: {
          error: 'Ошибка при обновлении данных',
          success: 'Данные пользователя успешно обновлены',
        },
        delete: {
          success: 'Пользователь успешно удалён',
        },
      },
      statuses: {
        new: {
          header: 'Создание нового статуса',
          submit: 'Отправить',
        },
        create: {
          success: 'Статус успешно создан',
          error: 'Ошибка при создании статуса',
        },
        update: {
          success: 'Статус успешно обновлён',
          error: 'Ошибка при обновлении статуса',
        },
        delete: {
          success: 'Статус успешно удалён',
          error: 'Ошибка при удалении статуса',
        },
      },
      tasks: {
        title: 'Задачи',
        create: 'Задача создана успешно',
        updated: 'Задача обновлена успешно',
        deleted: 'Задача удалена успешно',
        error: 'Ошибка при обработке задачи',
        deleteDenied: 'Вы не можете удалить эту задачу',
        name: 'Название',
        status: 'Статус',
        creator: 'Создатель',
        executor: 'Исполнитель',
      },

      authError: 'Доступ запрещён! Пожалуйста, войдите в систему',
    },

    layouts: {
      application: {
        users: 'Пользователи',
        signIn: 'Войти',
        signUp: 'Регистрация',
        signOut: 'Выйти',
        statuses: 'Статусы',
      },
    },

    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        createdAt: 'Дата создания',
        new: {
          submit: 'Зарегистрироваться',
          signUp: 'Регистрация',
        },
        edit: {
          editProfile: 'Редактировать профиль',
          submit: 'Сохранить',
        },
      },
      welcome: {
        index: {
          hello: 'Привет от Hexlet!',
          description: 'Онлайн школа программирования',
          more: 'Узнать больше',
        },
      },
      cover: {
        title: 'Менеджер задач',
        description: 'Организуйте свои задачи эффективно и без стресса.',
        getStarted: 'Начать',
      },
    },

    statuses: {
      index: {
        id: 'ID',
        header: 'Статусы',
        new: 'Создать статус',
        name: 'Название',
        createdAt: 'Дата создания',
        edit: 'Изменить',
        delete: 'Удалить',
        confirm: 'Вы уверены, что хотите удалить этот статус?',
      },
      edit: {
        header: 'Изменение статуса',
        submit: 'Изменить',
      },
    },

    tasks: {
      index: {
        title: 'Задачи',
        new: 'Создать задачу',
        id: 'ID',
        name: 'Название',
        status: 'Статус',
        creator: 'Создатель',
        createdAt: 'Дата создания',
        edit: 'Редактировать',
        delete: 'Удалить',
        confirm: 'Вы уверены, что хотите удалить эту задачу?',
      },
      new: {
        title: 'Новая задача',
        submit: 'Создать задачу',
        form: {
          name: 'Название',
          description: 'Описание',
          status: 'Статус',
          selectStatus: '',
          executor: 'Исполнитель',
          selectExecutor: '',
        },
      },
      edit: {
        title: 'Редактирование задачи',
        submit: 'Сохранить изменения',
        form: {
          name: 'Название',
          description: 'Описание',
          status: 'Статус',
        },
      },
      show: {
        title: 'Детали задачи',
        name: 'Название',
        description: 'Описание',
        status: 'Статус',
        creator: 'Создатель',
        createdAt: 'Дата создания',
        edit: 'Редактировать',
      },
    },

    actions: 'Действия',
    edit: 'Редактировать',
  },
};
