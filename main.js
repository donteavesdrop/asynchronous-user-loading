const users = [
    {
        id: 1,
        имя: "Алексей",
        возраст: 20
    },

    {
        id: 2,
        имя: "Дмитрий",
        возраст: 21
    },

    {
        id: 3,
        имя: "Роман",
        возраст: 25
    },

    {
        id: 4,
        имя: "Екатерина",
        возраст: 61
    },

    {
        id: 5,
        имя: "Катер",
        возраст: 62
    }
];

// Функция sleep, которая возвращает Promise
function sleep(seconds) {
    return new Promise(function(resolve) {
        setTimeout(resolve, seconds * 1000);
    });
}

function getUser(userId) {
    return sleep(1)
    .then(() =>
    {
        let user = users.find(user => user.id === userId);
        if (user) {
            return user;
        } else {
            throw new Error('Пользователь не найден.');
        }
    });
}

async function loadUsersSequentially(userIds) {
    const loadedUsers = [];
    for (let userId of userIds){
        try {
          let user = await getUser(userId);
            loadedUsers.push(user.id + " - " +  user.имя);
            console.log(`Пользователь ${user.id} (${user.имя}) загружен.`);
        } catch (error) {
            console.error(error.message)
        }
    }
    return loadedUsers
}

async function loadUsersInParallel(userIds) {
    // Создаем массив промисов для каждого пользователя
    const userPromises = userIds.map(userId => getUser(userId));
  
    try {
      // Загружаем пользователей параллельно и ожидаем завершения всех промисов
      const loadedUsersParallel = await Promise.all(userPromises);
      return loadedUsersParallel;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }


  async function main() {
    console.log('Начало загрузки пользователя:');
  
    try {
      let user = await getUser(1);
      console.log('Пользователь получен: ', user);
      console.log('Загрузка пользователя завершена');
      console.log('---');
    } catch (error) {
      console.error('Ошибка:', error.message);
    }
  
    console.log('Начало загрузки пользователей последовательно:');
  
    try {
      let loadedUsers = await loadUsersSequentially([1, 6, 3, 4, 5]);
      console.log("Пользователи загружены: ", loadedUsers.join(", "));
      console.log('---');
    } catch (error) {
      console.error('Ошибка:', error.message);
    }
  
    console.log('Начало загрузки пользователей параллельно:');
    try {
      let loadedUsersParallel = await loadUsersInParallel([2, 1, 3, 5]);
      loadedUsersParallel.forEach(function(user) {
        console.log(`${user.id} - ${user.имя}`);
      });
      console.log('Пользователи загружены параллельно: ');
    } catch (error) {
      console.error('Ошибка:', error.message);
    }
}
  
main();
