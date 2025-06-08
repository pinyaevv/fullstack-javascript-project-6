// @ts-check

export default {
  translation: {
    appName: 'Fastify Шаблон',
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
        accessDenied: 'Доступ запрещён',
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        update: {
          error: 'Ошибка при обновлении данных',
          success: 'Данные пользователя успешно обновлены',
        },
        delete: {
          success: 'Пользователь успешно удален',
        },
      },
      statuses: {
        create: {
          success: 'Статус создан успешно',
          error: 'Ошибка создания статуса',
        },
        edit: {
          notFound: 'Статус не найден',
        },
        update: {
          success: 'Статус успешно обновлен',
          error: 'Ошибка обновления статуса',
        },
        delete: {
          success: 'Cтатус успешно удален',
          error: 'Ошибка удаления статуса',
        },
        index: {
          header: "Task Statuses",
          newStatus: "New Status",
          noStatuses: "No statuses found.",
          table: {
            name: "Name",
            actions: "Actions"
          },
          edit: 'Edit',
          delete: "Delete",
          deleteConfirm: "Are you sure you want to delete this status?"
        },
        "new": {
          "header": "Create New Status",
          "submit": "Create"
        },
        "edit": {
          "header": "Edit Status",
          "submit": "Update"
        },
        "form": {
          "name": "Name",
          "cancel": "Cancel"
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
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        edit: {
          editProfile: 'Редактировать профиль',
          submit: 'Сохранить',
        },
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
      cover: {
        title: 'Менеджер задач',
        description: 'Организуйте свои задачи эффективно и без стресса.',
        getStarted: 'Начать работу',
      },
    },
  },
};

