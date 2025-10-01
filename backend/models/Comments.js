export default  (sequelize, DataTypes) => {
  const Comments = sequelize.define('Comments', {
    commentBody: {
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
Comments.associate = (models) => {
  Comments.belongsTo(models.Users, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  Comments.belongsTo(models.Posts, {   // ✅ tambahin ini juga
    foreignKey: "postId",
    onDelete: "CASCADE",
  });
};

  return Comments;
};
