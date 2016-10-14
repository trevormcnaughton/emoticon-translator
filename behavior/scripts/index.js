'use strict'

exports.handle = function handle(client) {

  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('app:response:name:welcome')
      client.updateConversationState({
        helloSent: true
      })
      client.done()
    }
  })

  const untrained = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('app:response:name:apology/untrained')
      client.done()
    }
  })

  client.runFlow({
    classifications: {},
    autoResponses: {
      'provide_shrug': {
        minimumConfidence: 0.5
      },
      'provide_tableflip': {
        minimumConfidence: 0.5
      },
      welcome: {
        minimumConfidence: 0.5
      },
    },
    streams: {
      main: 'onboarding',
      onboarding: [sayHello],
      end: [untrained]
    }
  })

  client.done()
}
