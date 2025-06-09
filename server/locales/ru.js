// @ts-check

export default {
  translation: {
    appName: 'Менеджер задач',
    flash: {
      session: {
        create: {
          success: 'Вы вошли в систему',
          error: 'Неверный email или пароль',
        },
        delete: {
          success: 'Вы вышли из системы',
        },
      },
      users: {
        accessDenied: 'Доступ запрещён',
        create: {
          error: 'Не удалось зарегистрироваться',
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
        create: {
          success: 'Статус успешно создан',
          error: 'Ошибка при создании статуса',
        },
        edit: {
          notFound: 'Статус не найден',
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
      authError: 'Доступ запрещён! Пожалуйста, войдите в систему',
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
          hello: 'Привет от Хекслета!',
          description: 'Онлайн-школа программирования',
          more: 'Узнать больше',
        },
      },
      cover: {
        title: 'Менеджер задач',
        description: 'Организуйте свои задачи эффективно и без стресса.',
        getStarted: 'Начать',
      },
    },
  },
};
