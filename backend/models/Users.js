export default (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // mencegah nama yang sama dengan nama sebelumnya
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // mencegah email duplikat
      validate: {
        isEmail: true,
      },
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true, // biar 1 akun Google = 1 user
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true, // simpan display name dari Google
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    verified: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  Users.associate = (models) => {
    Users.hasMany(models.Likes, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      hooks: true,
    });

    Users.hasMany(models.Comments, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      hooks: true,
    });

    Users.hasMany(models.Posts, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      hooks: true,
    });
  };
  return Users;
};
