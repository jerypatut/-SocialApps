export default (sequelize, DataTypes) => {
  const Posts = sequelize.define('Posts', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: { // 👈 WAJIB untuk relasi ke Users
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // harus sesuai dengan nama tabel Users
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  });

  Posts.associate = (models) => {
    // Relasi ke Comments
    Posts.hasMany(models.Comments, {
      foreignKey: "postId",
      onDelete: "CASCADE",
      hooks: true,
    });

    // Relasi ke Likes
    Posts.hasMany(models.Likes, {
      foreignKey: "postId",
      onDelete: "CASCADE",
      hooks: true,
    });

    // Relasi ke Users
    Posts.belongsTo(models.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return Posts;
};


