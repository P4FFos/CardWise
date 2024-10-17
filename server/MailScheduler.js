const mongoose = require('mongoose')
const User = require('../server/models/user')
const NodeMailer = require('./NodeMailer')

const mailer = new NodeMailer()

//var millisInOneDay = 1000 * 60 * 60 * 24

//For Testing
//var millisInOneMin = 1000 * 60
async function sendScheduledMail() {
    try {
        const users = await User.find()

        users.forEach(async (user) => {
            if (user.emailSettings.notifications === 'reminder') {
                const now = new Date()
                const lastReminderSent = user.emailSettings.lastReminderSent || new Date(0)
                const daysSinceLastReminder = Math.floor((now - lastReminderSent) / (millisInOneMin))
            
                //For Testing
                //const minutesSinceLastReminder = (user.emailSettings.reminderInterval || 1) * millisInOneMin
                
                if (user.emailSettings.notifications === 'reminder' && daysSinceLastReminder >= user.emailSettings.reminderInterval) {
                    const subject = "Reminder to practice your decks!"
                    const content = `Hi ${user.username}!\nIt is time to practice`
                
                    try {
                        await mailer.sendEmail(user.email, subject, content)
                        console.log(`Email has been sent to ${user.email}`)

                        user.emailSettings.lastReminderSent = now
                        await user.save()
                    } catch (error) {
                        console.error(`Error sending email to ${user.email}: `, error)
                    }
                }
            }
        })
    } catch (error) {
        console.error("Error fetching users:", error)
    }
}

module.exports = sendScheduledMail