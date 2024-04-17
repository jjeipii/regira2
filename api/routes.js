const express = require('express'); // Importa la llibreria Express per gestionar les rutes
const router = express.Router(); // Crea un router d'Express
const multer = require('multer'); // Importa la llibreria multer per gestionar peticions de fitxers
const bcrypt = require('bcrypt'); // Importa la llibreria bcrypt per a encriptar contrasenyes
const jwt = require('jsonwebtoken'); // Importa la llibreria jsonwebtoken per a generar i verificar JWT

const SECRET_KEY = "el-fiera-rumano-cinefilo"; // Clau secreta per a la generació de JWT

const { Tag,
    Usuari,
    Projecte,
    Issue,
    Comment,
    TagIssue } = require('./model_regira'); // Importa els models de dades

const {
    readItem,
    readItems,
    readItemForUser,
    readItemsForUser,
    updateItem,
    createItem,
    getEstadosIssue,
    getTiposIssue,
    getPriorityIssue
    } = require('./generic'); 

// AUTENTICACIO

/*
    USUARIS
    USUARIS
    USUARIS
    USUARIS
    USUARIS
*/

// Middleware per verificar el JWT en la cookie
const checkToken = (req, res, next) => {
    const token = req.cookies?.token; // Obté el token des de la cookie de la petició
    if (!token) {
      return res.status(401).json({ error: 'Validate perro' }); // Retorna error 401 si no hi ha cap token
    }
  
    try {
      const decodedToken = jwt.verify(token, SECRET_KEY); // Verifica el token utilitzant la clau secreta
      req.usuariId = decodedToken.usuariId; // Estableix l'ID d'usuari a l'objecte de la petició
      next(); // Passa al següent middleware
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' }); // Retorna error 401 si el token és invàlid
    }
  };

//
router.get('/usuaris',checkToken, async (req, res) => await readItems(req, res, Usuari))


// Endpoint per iniciar sessió d'un usuari
router.post('/login', async (req, res) => {
  const { email_usuari, password } = req.body; // Obté l'email i la contrasenya de la petició
  try {
    const user = await Usuari.findOne({ where: { email_usuari } }); // Cerca l'usuari pel seu email
    if (!user) {
      return res.status(404).json({ error: 'User no trobat' }); // Retorna error 404 si l'usuari no es troba
    }
    const passwordMatch = await bcrypt.compare(password, user.password); // Compara la contrasenya proporcionada amb la contrasenya encriptada de l'usuari
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Password incorrecte' }); // Retorna error 401 si la contrasenya és incorrecta
    }
    const token = jwt.sign({ usuariId: user.id, userName: user.nom_usuari }, SECRET_KEY, { expiresIn: '2h' }); // Genera un token JWT vàlid durant 2 hores
    res.cookie('token', token, { httpOnly: false, maxAge: 7200000 }); // Estableix el token com una cookie
    res.json({ message: 'Login correcte' }); // Retorna missatge d'èxit
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
  }
});

// Endpoint per registrar un usuari
router.post('/register', async (req, res) => {
  try {
    const { nom_usuari, email_usuari, password } = req.body; // Obté el nom, email i contrasenya de la petició
    if (!nom_usuari || !email_usuari || !password) {
      return res.status(400).json({ error: 'Name, email, i password requerits' }); // Retorna error 400 si no es proporcionen el nom, email o contrasenya
    }
    const existingUser = await Usuari.findOne({ where: { email_usuari } }); // Comprova si l'email ja està registrat
    if (existingUser) {
      return res.status(400).json({ error: 'Email ja existeix' }); // Retorna error 400 si l'email ja està registrat
    }
    const usuario = await Usuari.create({ nom_usuari, email_usuari, password }); // Crea l'usuari amb les dades proporcionades
    res.status(201).json(usuario); // Retorna l'usuari creat amb el codi d'estat 201 (Creat)
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
  }
});

/*
    PROJECTES
    PROJECTES
    PROJECTES
    PROJECTES
    PROJECTES
    
*/

router.get('/projectes', checkToken, async (req, res) => await readItemsForUser(req, res, Projecte)); // Llegeix un bolet específic
router.get('/projectes/:id', checkToken, async (req, res) => await readItemForUser(req, res, Projecte)); // Llegeix un bolet específic
router.put('/projectes/:id', checkToken, async (req, res) => await updateItem(req, res, Projecte)); // Actualitza un bolet
router.delete('/projectes/:id', checkToken, async (req, res) => await deleteItem(req, res, Projecte)); // Elimina un bolet


  
// Endpoint per crear un projecte 
router.post('/projecte/new', checkToken, async (req, res, next) => {
    try {
      const user = await Usuari.findByPk(req.usuariId); // Cerca l'usuari pel seu ID
      if (!user) {
        return res.status(500).json({ error: 'User no trobat' }); // Retorna error 500 si no es troba l'usuari
      }
      const projectes = await Projecte.findAll(); // Cerca l'usuari pel seu ID
      const projecte = projectes.find(projecte => projecte.nom_projecte == req.body.nom_projecte);
      if(projecte){ 
        return res.status(500).json({ error: 'Nom de projecte no vàlid' });
      }
      const item = await user.createProjecte(req.body); 
      res.status(201).json(item); // Retorna l'usuari creat amb el codi d'estat 201 (Creat)
    } catch (error) {
      res.status(500).json({ error: error.message}); // Retorna error 500 amb el missatge d'error
    }
  });

// Endpoint per agafar issues per a un projecte
router.get('/projecte/:id/issues', checkToken, async (req, res, next) => {
  try {
    const user = await Usuari.findByPk(req.usuariId); // Cerca l'usuari pel seu ID
    if (!user) {
      return res.status(500).json({ error: 'User no trobat' }); // Retorna error 500 si no es troba l'usuari
    }
    const issues = await Issue.findAll({where: {projectId : req.params.id}}); // Cerca l'usuari pel seu ID
    if(!issues){ 
      return res.status(500).json({ error: 'Issues no trobats' });
    }
    res.status(201).json(issues); // Retorna l'usuari creat amb el codi d'estat 201 (Creat)
  } catch (error) {
    res.status(500).json({ error: error.message}); // Retorna error 500 amb el missatge d'error
  }
});

/*
    ISSUES
    ISSUES
    ISSUES
    ISSUES
    ISSUES
    
*/

router.get('/issue/estados', checkToken, async (req, res) => await getEstadosIssue(req, res, Issue)); // Llegeix un bolet específic
router.get('/issue/tipos', checkToken, async (req, res) => await getTiposIssue(req, res, Issue)); // Llegeix un bolet específic
router.get('/issue/priority', checkToken, async (req, res) => await getPriorityIssue(req, res, Issue)); // Llegeix un bolet específic
// Endpoint per crear un issue 
router.post('/issue/new', checkToken, async (req, res, next) => {
  try {
    const user = await Usuari.findByPk(req.usuariId); // Cerca l'usuari pel seu ID
    if (!user) {
      return res.status(500).json({ error: 'User no trobat' }); // Retorna error 500 si no es troba l'usuari
    }
    const { nom_issue, tipo_issue, priority, estado_issue, idProjecte } = req.body;
    if (!nom_issue ) {
      return res.status(400).json({ error: 'Nom issue requerit' }); // Retorna error 400 si no es proporcionen el nom, email o contrasenya
    }
    if (!tipo_issue) {
      return res.status(400).json({ error: 'Tipo requerit' }); // Retorna error 400 si no es proporcionen el nom, email o contrasenya
    }
    let attributes = await Issue.rawAttributes.tipo_issue.values;
    if (!attributes.includes(tipo_issue)) {
      return res.status(400).json({ error: 'Tipo no vàlid' });
    }
    if (!priority) {
      return res.status(400).json({ error: 'Prioritat requerida' }); // Retorna error 400 si no es proporcionen el nom, email o contrasenya
    }
    attributes = await Issue.rawAttributes.priority.values;
    if (!attributes.includes(priority)) {
      return res.status(400).json({ error: 'Prioritat no vàlida' });
    }
    if (!estado_issue) {
      return res.status(400).json({ error: 'Estado requerit' }); // Retorna error 400 si no es proporcionen el nom, email o contrasenya
    }
    attributes = await Issue.rawAttributes.estado_issue.values;
    if (!attributes.includes(estado_issue)) {
      return res.status(400).json({ error: 'Estado issue no vàlid' });
    }
    if (!idProjecte) {
      return res.status(400).json({ error: ' ID projecte requerit' }); // Retorna error 400 si no es proporcionen el nom, email o contrasenya
    }
    const projecte = await Projecte.findByPk(idProjecte); // Cerca l'usuari pel seu ID
    if(!projecte){ 
      return res.status(500).json({ error: 'Projecte no encontrat' });
    }

    const item = await Issue.create({
      nom_issue,
      tipo_issue,
      priority,
      estado_issue,
      projectId: idProjecte,
      usuariId: req.usuariId,
    })
    res.status(201).json(item); // Retorna l'usuari creat amb el codi d'estat 201 (Creat)
  } catch (error) {
    res.status(500).json({ error: error.message}); // Retorna error 500 amb el missatge d'error
  }
});

router.put('/issues/:id', checkToken, async (req, res) => updateItem(req, res, Issue))

router.delete('/issue/delete',checkToken, async (req, res) => {
  try {
    const user = await Usuari.findByPk(req.usuariId); // Cerca l'usuari pel seu ID
    if (!user) {
      return res.status(500).json({ error: 'User no trobat' }); // Retorna error 500 si no es troba l'usuari
    }
    const { id } = req.body;
    if ( !id ) {
      return res.status(400).json({ error: 'Id no trobad' }); // Retorna error 400 si no es proporcionen el nom, email o contrasenya
    }
    // Eliminar los comentarios relacionados con la issue
    await Comment.destroy({ where: { issueId: id } });

    // Eliminar la issue
    const deletedCount = await Issue.destroy({ where: { id } });

    if (deletedCount === 0) {
      return res.status(404).json({ error: 'No se encontró la issue con el ID proporcionado' });
    }

    res.status(200).json({ message: 'Issue eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message}); // Retorna error 500 amb el missatge d'error
  }
})
  

module.exports = router;