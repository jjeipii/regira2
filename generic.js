const readItem = async (req,res,Model) => {
    try {
      const item = await Model.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

const readItemForUser = async (req,res,Model) => {
    try {
      if (!req.usuariId) {
        return res.status(404).json({ error: 'Unathorized' });
      }
      const item = await Model.findOne({where: {id: req.params.id, usuariId: req.usuariId}});
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  const readItems = async (req,res,Model) => {
    try {
      const items = await Model.findAll();
      res.json(items);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

const readItemsForUser = async (req,res,Model) => {
    try {
      const items = await Model.findAll({where: {usuariId: req.usuariId}});
      res.json(items);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

const createItem = async (req,res,Model) => {
    try {
        const item = await Model.create(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getEstadosIssue = async (req,res,Model ) => {
  try {
      const attributes = await Model.rawAttributes.estado_issue.values;
      res.status(201).json(attributes);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}

const getTiposIssue = async (req,res,Model ) => {
  try {
      const attributes = await Model.rawAttributes.tipo_issue.values;
      res.status(201).json(attributes);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}

const getPriorityIssue = async (req,res,Model ) => {
  try {
      const attributes = await Model.rawAttributes.priority.values;
      res.status(201).json(attributes);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}

module.exports = {
    readItem,
    readItems,
    createItem,
    readItemForUser,
    readItemsForUser,
    getEstadosIssue,
    getTiposIssue,
    getPriorityIssue
}  