const md5 = require('md5');
const { v4 } = require('uuid');
const { writeFile } = require('fs').promises;
const dictionary = require('./dictionary');

const { levelUp, usersPath } = dictionary;

const getRandomClass = () => {
  const minCeiled = Math.ceil(0);
  const maxFloored = Math.floor(classes.length - 1);
  const randomIndex = Math.floor(
    Math.random() * (maxFloored - minCeiled) + minCeiled
  );

  const selectedClass = classes[randomIndex];

  return `${selectedClass.slice(0, 1).toUpperCase()}${selectedClass
    .slice(1)
    .toLowerCase()}`;
};

const classes = Array.from(
  new Set(
    ['Warrior', 'Hunter', 'Mage', 'Priest', 'Rogue', 'Druid', 'Shaman'].map(
      (i) => i.toLowerCase()
    )
  )
);

const createUser = ({ id, login, password, data = {} }) => ({
  id,
  login,
  hash: md5(`${login}:${password}`),
  data,
});

const addUser = ({ login, password, users = [] }) => {
  const id = v4();
  const characterClass = getRandomClass();
  const level = 1;

  writeFile(
    usersPath,
    JSON.stringify([
      ...users,
      createUser({
        id,
        login,
        password,
        data: {
          name: 'Nameless hero',
          class: characterClass,
          level,
        },
      }),
    ]),
    {
      encoding: 'utf8',
    }
  );

  return {
    status: 201,
    userId: id,
    message: `${levelUp} You are now a “Level ${level} API ${characterClass}”.`,
    description: "Let's see your profile.",
    guide: {
      method: 'GET',
      url: '/api/v1/learn/api/user/<your-id>',
    },
  };
};

const updateUserName = ({ id, level, name, users }) => {
  const updatedLevel = level + 1;

  const updatedUserList = users.map((user) => {
    if (user.id === id) {
      return {
        ...user,
        data: {
          ...user.data,
          name,
          level: updatedLevel,
        },
      };
    }

    return user;
  });

  writeFile(usersPath, JSON.stringify(updatedUserList), {
    encoding: 'utf8',
  });

  return {
    status: 200,
    userId: id,
    message: `${levelUp} You are now a “Level ${updatedLevel} API ${characterClass}”.`,
    description: "Let's see your profile.",
    guide: {
      method: 'GET',
      url: '/api/v1/learn/api/user/<your-id>',
    },
  };
};

module.exports = {
  addUser,
};
