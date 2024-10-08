
// Es defineix la configuració de sequelize
const {Sequelize, DataTypes} = require('sequelize'); // Importa la llibreria Sequeli
const bcrypt = require('bcrypt'); // Importa la llibreria bcrypt per a encriptar contrasenyes

// INICIALITZACIO BASE DE DADES

// creem instancia de sequelize, indicant base de dades
// en l'exemple: tipus sqlite, desada en memoria (s'esborra cada vegada)
const sequelize = new Sequelize(
    'regira2', 'root', 'root',
    {
        dialect: 'mysql',
        host: 'localhost',
        port: '3306'
    });


// Definim model d'usuari (exemple, no és imprescindible)
const Tag = sequelize.define('tag', {
    nom_tag: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
}, { timestamps: false });


const Usuari = sequelize.define('usuari', {
    nom_usuari: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email_usuari: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false // No es permet valor nul per a la contrasenya
      }
}, { timestamps: false });


const Projecte = sequelize.define('projecte', {
    nom_projecte: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    desc_project: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
         defaultValue: true
    }
}, { timestamps: true });


const Issue = sequelize.define('issue', {
    nom_issue: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    tipo_issue: {
        type: Sequelize.ENUM,
        values : ['bug','story','task'],
        allowNull: true,
        unique: false,
    },
    priority: {
        type: Sequelize.ENUM,
        values : ['high','mid','low'],
        allowNull: true,
        unique: false,
    },
    estado_issue: {
        type: Sequelize.ENUM,
        values : ['blocklog','in progress','review', 'testing', 'done'],
        allowNull: true,
        unique: false,
    }
}, { timestamps: true });



const Comment = sequelize.define('comment', {
    nom_comment: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    }
}, { timestamps: false });

const TagIssue = sequelize.define('tag_issue', {
    // No es necesario definir campos adicionales
});


// hook per encriptar la contrasenya abans de desar un nou usuari
Usuari.beforeCreate(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10); // Encripta la contrasenya amb bcrypt
    user.password = hashedPassword;
  });
  

/* 
    TAGS
    Usuaris
    Project: Usuari
    Issues: Projectes, Autor(usuarios), User(usuarios)
    Tags
    Tags_Issues: Tags, Issue
    Comments : Issues, Usuarios

*/

// Relaciones entre modelos con eliminación en cascada
Usuari.hasMany(Projecte, { foreignKey: 'usuariId', onDelete: 'CASCADE' }); // Eliminación en cascada cuando se elimina un usuario
Projecte.belongsTo(Usuari, { foreignKey: 'usuariId' });

Usuari.hasMany(Comment, { foreignKey: 'usuariId', onDelete: 'CASCADE' }); // Eliminación en cascada cuando se elimina un usuario
Comment.belongsTo(Usuari, { foreignKey: 'usuariId' });

Usuari.hasMany(Issue, { foreignKey: 'usuariId', onDelete: 'CASCADE' }); // Eliminación en cascada cuando se elimina un usuario
Issue.belongsTo(Usuari, { foreignKey: 'usuariId', as: 'creator' });
Issue.belongsTo(Usuari, { foreignKey: 'assignedUserId', as: 'assignedUser' });

Projecte.hasMany(Issue, { foreignKey: 'projectId', onDelete: 'CASCADE', onUpdate: 'CASCADE', }); // Eliminación en cascada cuando se elimina un proyecto
Issue.belongsTo(Projecte, { foreignKey: 'projectId' });

Issue.belongsToMany(Tag, { through: 'tag_issue', onDelete: 'CASCADE', onUpdate: 'CASCADE', }); // Eliminación en cascada cuando se elimina una issue o un tag
Tag.belongsToMany(Issue, { through: 'tag_issue', onDelete: 'CASCADE', onUpdate: 'CASCADE', });

// Relaciones entre modelos con eliminación en cascada
Issue.hasMany(Comment, { foreignKey: 'issueId', onDelete: 'CASCADE',onUpdate: 'CASCADE', }); // Eliminación en cascada cuando se elimina una issue
Comment.belongsTo(Issue, { foreignKey: 'issueId' }); // Un comentario pertenece a un issue

//sequelize.sync({force: true}); //

module.exports = {
    Tag,
    Usuari,
    Projecte,
    Issue,
    Comment,
    TagIssue
}