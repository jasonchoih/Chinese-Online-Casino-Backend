//
module.exports = (DataTypes) => {
    return {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          title_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '标题ID'
          },
          content: {
            type: DataTypes.TEXT,
            comment: '内容'
          }
    }
};