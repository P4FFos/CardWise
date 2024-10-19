const mongoose = require('mongoose')
const User = require('../server/models/user')
const NodeMailer = require('./NodeMailer')

const mailer = new NodeMailer()

var millisInOneDay = 1000 * 60 * 60 * 24


async function sendScheduledMail() {
    try {
        const users = await User.find()

        users.forEach(async (user) => {
            if (user.emailSettings.notifications === 'reminder') {
                const now = new Date()
                var lastReminderSent = user.emailSettings.lastReminderSent || null
                const daysBetweenReminders = user.emailSettings.reminderInterval || 1
                const millisBetweenReminders = daysBetweenReminders * millisInOneDay
                

                if (lastReminderSent === null || (now.getTime() - lastReminderSent.getTime()) >= millisBetweenReminders) {
                    
                    const startOfToday = new Date(now.toLocaleString("sv-SE", { timeZone: 'Europe/Stockholm'}));
                    startOfToday.setHours(0,0,0,0)

                    console.log("Entered (now - lastReminderSent) >= millisBetweenReminders) if statement")       
                    const timesPerDay = user.emailSettings.timesPerDay
                    const millisBetweenEmails = millisInOneDay / timesPerDay
                    
                    
                    const emailSendTimes = []
                    for (var i = 0; i < timesPerDay; i++) {
                        const emailTime = new Date(startOfToday.getTime() + (i * millisBetweenEmails))
                        console.log(`index: ${i}. Time: ${emailTime.toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })}`)
                        emailSendTimes.push(emailTime)
                    }

                    var emailsSent = 0
                    for (const emailTime of emailSendTimes) {
                        if (now >= emailTime && (!lastReminderSent || emailTime > lastReminderSent)) {
                            const subject = "Reminder to practice your decks!"
                            const content = `Hi ${user.username}!\nIt is time to practice`
                        
                            try {
                                await mailer.sendEmail(user.email, subject, content)
                                console.log(`Email has been sent to ${user.email} at ${emailTime.toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })}` )
                                emailsSent++
                            } catch (error) {
                                console.error(`Error sending email to ${user.email}: `, error)
                            } 
                        }
                    }
                    if (emailsSent > 0) {
                        user.emailSettings.lastReminderSent = new Date()
                        console.log(user.emailSettings.lastReminderSent)
                        await user.save()
                    }
                }
            }
        })
    } catch (error) {
        console.error("Error fetching users:", error)
    }
}
// Run every hour

module.exports = sendScheduledMail