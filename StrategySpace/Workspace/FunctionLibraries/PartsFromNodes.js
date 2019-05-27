function newPartsFromNodes () {
  thisObject = {
    createPartFromNode: createPartFromNode,
    newStrategy: newStrategy,
    addPhase: addPhase,
    addSituation: addSituation,
    addCondition: addCondition
  }

  return thisObject

  function createPartFromNode (node, parentNode, chainParent) {
    switch (node.type) {
      case 'Condition':
        {
          let condition = node
          createPart('Condition', condition.name, condition, parentNode, chainParent, 'Condition')
          return
        }
      case 'Situation': {
        let situation = node
        createPart('Situation', situation.name, situation, parentNode, chainParent, 'Situation')
        for (let m = 0; m < node.conditions.length; m++) {
          let condition = node.conditions[m]
          createPartFromNode(condition, situation, situation)
        }
        return
      }
      case 'Phase': {
        let phase = node
        createPart('Phase', phase.name, phase, parentNode, chainParent, phase.subType)
        for (let m = 0; m < node.situations.length; m++) {
          let situation = node.situations[m]
          createPartFromNode(situation, phase, phase)
        }
        return
      }
      case 'Stop': {
        let lastPhase
        let stop = node
        createPart('Stop', stop.name, stop, parentNode, chainParent, 'Stop')
        for (let m = 0; m < node.phases.length; m++) {
          let phase = node.phases[m]
          let thisChainParent
          if (m === 0) {
            thisChainParent = node
          } else {
            thisChainParent = lastPhase
          }
          lastPhase = phase
          createPartFromNode(phase, stop, thisChainParent)
        }
        return
      }
      case 'Take Profit': {
        let lastPhase
        let takeProfit = node
        createPart('Take Profit', takeProfit.name, takeProfit, parentNode, chainParent, 'Take Profit')
        for (let m = 0; m < node.phases.length; m++) {
          let phase = node.phases[m]
          let thisChainParent
          if (m === 0) {
            thisChainParent = node
          } else {
            thisChainParent = lastPhase
          }
          lastPhase = phase
          createPartFromNode(phase, takeProfit, thisChainParent)
        }
        return
      }
      case 'Initial Definition': {
        createPart('Initial Definition', node.name, node, parentNode, chainParent, 'Initial Definition')
        return
      }
      case 'Take Position Event': {
        let event = node
        createPart('Take Position Event', event.name, event, parentNode, chainParent, 'Take Position Event')
        for (let m = 0; m < node.situations.length; m++) {
          let situation = node.situations[m]
          createPartFromNode(situation, event, event)
        }
        return
      }
      case 'Trigger On Event': {
        let event = node
        createPart('Trigger On Event', event.name, event, parentNode, chainParent, 'Trigger On Event')
        for (let m = 0; m < node.situations.length; m++) {
          let situation = node.situations[m]
          createPartFromNode(situation, event, event)
        }
        return
      }
      case 'Trigger Off Event': {
        let event = node
        createPart('Trigger Off Event', event.name, event, parentNode, chainParent, 'Trigger Off Event')
        for (let m = 0; m < node.situations.length; m++) {
          let situation = node.situations[m]
          createPartFromNode(situation, event, event)
        }
        return
      }
      case 'Trigger Stage': {
        let stage = node
        createPart('Trigger Stage', stage.name, stage, parentNode, chainParent, 'Trigger Stage')

        if (node.entryPoint !== undefined) {
          createPartFromNode(node.entryPoint, stage, stage)
        }
        if (node.exitPoint !== undefined) {
          createPartFromNode(node.exitPoint, stage, stage)
        }
        if (node.sellPoint !== undefined) {
          createPartFromNode(node.sellPoint, stage, stage)
        }
        return
      }
      case 'Open Stage': {
        let stage = node
        createPart('Open Stage', stage.name, stage, parentNode, chainParent, 'Open Stage')

        if (node.initialDefinition !== undefined) {
          createPartFromNode(node.initialDefinition, stage, stage)
        }
        return
      }
      case 'Manage Stage': {
        let stage = node
        createPart('Manage Stage', stage.name, stage, parentNode, chainParent, 'Manage Stage')

        if (node.stopLoss !== undefined) {
          createPartFromNode(node.stopLoss, stage, stage)
        }
        if (node.buyOrder !== undefined) {
          createPartFromNode(node.buyOrder, stage, stage)
        }
        return
      }
      case 'Close Stage': {
        let stage = node
        createPart('Close Stage', stage.name, stage, parentNode, chainParent, 'Close Stage')
        return
      }
      case 'Strategy': {
        let strategy = node
        createPart('Strategy', strategy.name, strategy, parentNode, chainParent, 'Strategy')
        if (node.triggerStage !== undefined) {
          createPartFromNode(node.triggerStage, strategy, strategy)
        }
        if (node.openStage !== undefined) {
          createPartFromNode(node.openStage, strategy, strategy)
        }
        if (node.manageStage !== undefined) {
          createPartFromNode(node.manageStage, strategy, strategy)
        }
        if (node.closeStage !== undefined) {
          createPartFromNode(node.closeStage, strategy, strategy)
        }
        return
      }
      case 'Trading System': {
        let tradingSystem = node
        createPart('Trading System', tradingSystem.name, tradingSystem, parentNode, chainParent, 'Trading System')
        for (let m = 0; m < node.strategies.length; m++) {
          let strategy = node.strategies[m]
          createPartFromNode(strategy, tradingSystem, tradingSystem)
        }
        return
      }
    }
  }

  function newStrategy (parentNode) {
    let strategyParent = parentNode
    let strategy = {
      name: 'New Strategy',
      active: true,
      triggerStage: {
        entryPoint: {
          situations: []
        },
        exitPoint: {
          situations: []
        },
        sellPoint: {
          situations: []
        }
      },
      openStage: {
        initialDefinition: {}
      },
      manageStage: {
        stopLoss: {
          phases: []
        },
        buyOrder: {
          phases: []
        }
      },
      closeStage: {
      }
    }

    strategyParent.strategies.push(strategy)
    createPart('Strategy', strategy.name, strategy, strategyParent, strategyParent, 'Strategy')
    createPart('Trigger Stage', '', strategy.triggerStage, strategy, strategy, 'Trigger Stage')
    createPart('Open Stage', '', strategy.openStage, strategy, strategy, 'Open Stage')
    createPart('Manage Stage', '', strategy.manageStage, strategy, strategy, 'Manage Stage')
    createPart('Close Stage', '', strategy.closeStage, strategy, strategy, 'Close Stage')
    createPart('Trigger On Event', '', strategy.triggerStage.entryPoint, strategy.triggerStage, strategy.triggerStage)
    createPart('Trigger Off Event', '', strategy.triggerStage.exitPoint, strategy.triggerStage, strategy.triggerStage)
    createPart('Take Position Event', '', strategy.triggerStage.sellPoint, strategy.triggerStage, strategy.triggerStage)
    createPart('Initial Definition', '', strategy.openStage.initialDefinition, strategy.openStage, strategy.openStage)
    createPart('Stop', '', strategy.manageStage.stopLoss, strategy.manageStage, strategy.manageStage)
    createPart('Take Profit', '', strategy.manageStage.buyOrder, strategy.manageStage, strategy.manageStage)
  }

  function addPhase (parentNode) {
    let phaseParent = parentNode
    let m = phaseParent.phases.length
    let phase = {
      name: 'New Phase',
      code: '',
      situations: []
    }
    phaseParent.phases.push(phase)
    let phaseChainParent
    if (m > 0) {
      phaseChainParent = phaseParent.phases[m - 1]
    } else {
      phaseChainParent = phaseParent
    }
    createPart('Phase', phase.name, phase, phaseParent, phaseChainParent, 'Phase')
  }

  function addSituation (parentNode) {
    let phase = parentNode
    let m = phase.situations.length
    let situation = {
      name: 'New Situation',
      conditions: []
    }
    phase.situations.push(situation)
    createPart('Situation', situation.name, situation, phase, phase, 'Situation')
  }

  function addCondition (parentNode) {
    let situation = parentNode
    let m = situation.conditions.length
    let condition = {
      name: 'New Condition',
      code: ''
    }
    situation.conditions.push(condition)
    createPart('Condition', condition.name, condition, situation, situation, 'Condition')
  }

  function createPart (partType, name, node, parentNode, chainParent, title) {
    let payload = {}

    if (name === '' || name === undefined) { name = 'My ' + partType }
    if (node.savedPayload !== undefined) {
      payload.targetPosition = {
        x: node.savedPayload.targetPosition.x,
        y: node.savedPayload.targetPosition.y
      }
      node.savedPayload.targetPosition = undefined
    } else {
      if (chainParent === undefined) {
        payload.targetPosition = {
          x: spawnPosition.x,
          y: spawnPosition.y
        }
      } else {
        payload.targetPosition = {
          x: chainParent.payload.position.x,
          y: chainParent.payload.position.y
        }
      }
    }

    if (title !== undefined) {
      payload.subTitle = title
    } else {
      payload.subTitle = partType
    }

    payload.visible = true
    payload.title = name
    payload.node = node
    payload.parentNode = parentNode
    payload.chainParent = chainParent
    payload.onMenuItemClick = canvas.strategySpace.workspace.onMenuItemClick

    if (node.id === undefined) {
      node.id = newUniqueId()
    }
    node.payload = payload
    node.type = partType
    canvas.floatingSpace.strategyPartConstructor.createStrategyPart(payload)
  }
}
