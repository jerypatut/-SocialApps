export default (sequelize, DataTypes) => {
  const Likes = sequelize.define('Likes', {
    userId: { // 👈 WAJIB untuk relasi ke Users
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // harus sesuai dengan nama tabel Users
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    postId: {   // ✅ wajib biar relasi ke Posts
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  });

  Likes.associate = (models) => {
  Likes.belongsTo(models.Users, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  Likes.belongsTo(models.Posts, {   // ✅ tambahin ini juga
    foreignKey: "postId",
    onDelete: "CASCADE",
  });
};

  return Likes;
};
