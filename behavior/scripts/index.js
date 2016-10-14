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

  const handleShrug = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('app:response:name:provide_translation')
      client.done()
    }
  })

  client.runFlow({
    classifications: {
      'request_translation/shrug': 'handleShrug'
			// map inbound message classifications to names of streams
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
      main: 'onboarding',
      handleShrug: [handleShrug],
      onboarding: [sayHello],
      end: [untrained]
    }
  })
}
