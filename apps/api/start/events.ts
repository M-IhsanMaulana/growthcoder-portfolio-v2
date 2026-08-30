import emitter from '@adonisjs/core/services/emitter'
import RecordActivityEvent from '#events/record_activity'

emitter.on(RecordActivityEvent, async (event) => {
  const { default: LogActivityListener } = await import('#listeners/log_activity_listener')
  await new LogActivityListener().handle(event)
})
