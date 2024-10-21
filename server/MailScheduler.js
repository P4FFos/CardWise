const mongoose = require('mongoose')
const User = require('../server/models/user')
const NodeMailer = require('./NodeMailer')

const mailer = new NodeMailer()

var millisInOneDay = 1000 * 60 * 60 * 24


async function sendScheduledMail() {
    try {
        const users = await User.find({ "emailSettings.notifications": { $ne: ["none"] } })

        users.forEach(async (user) => {
            const notifications = user.emailSettings.notifications
            const reminderInterval = user.emailSettings.reminderInterval
            const timesPerDay = user.emailSettings.timesPerDay
            const lastReminderSent = user.emailSettings.lastReminderSent || null

            if (notifications.includes("none")) {
                return
            }

            const now = new Date()
            const daysBetweenReminders = reminderInterval || 1
            const millisBetweenReminders = daysBetweenReminders * millisInOneDay

            if (lastReminderSent === null || (now.getTime() - lastReminderSent.getTime()) >= millisBetweenReminders) {
                
                const startOfToday = new Date(now.toLocaleString("sv-SE", { timeZone: 'Europe/Stockholm'}));
                startOfToday.setHours(0,0,0,0)

                const startOfTomorrow = new Date(startOfToday)
                startOfTomorrow.setDate(startOfTomorrow.getDate() + 1)
                startOfTomorrow.setHours(0,0,0,0)

                const millisBetweenEmails = millisInOneDay / timesPerDay
                const emailSendTimes = createEmailsForTheDay(timesPerDay, startOfTomorrow, millisBetweenEmails)
                
                var emailsSentForDay = 0

                for (const notificationType of notifications) {
                    if (notificationType === "reminder") {
                        emailsSentForDay += await sendEmailsForTheDay(emailSendTimes, now, lastReminderSent, user, "reminder")
                    } else if (notificationType === "emptyDeck" && (!user.decks.cards || user.decks.cards.length === 0)) {
                        emailsSentForDay += await sendEmailsForTheDay(emailSendTimes, now, lastReminderSent, user, "emptyDeck")
                    } else if (notificationType === "noDecks" && (!user.decks || Object.keys(user.decks).length === 0)) {
                        emailsSentForDay += await sendEmailsForTheDay(emailSendTimes, now, lastReminderSent, user, "noDecks")
                    }
                }
                
                if (emailsSentForDay > 0) {
                    user.emailSettings.lastReminderSent = new Date()
                    console.log(user.emailSettings.lastReminderSent)
                    await user.save()
                }
            }
        })
    } catch (error) {
        console.error("Error fetching users:", error)
    }
}

function createEmailsForTheDay(timesPerDay, startOfTomorrow, millisBetweenEmails) {
    const emailSendTimes = []
    for (var i = 0; i < timesPerDay; i++) {
        const emailTime = new Date(startOfTomorrow.getTime() + (i * millisBetweenEmails))
        console.log(`index: ${i}. Time: ${emailTime.toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })}`)
        emailSendTimes.push(emailTime)
    }
    return emailSendTimes
}

async function sendEmailsForTheDay(emailSendTimes, now, lastReminderSent, user, notificationType) {
    var emailsSent = 0
    for (const emailTime of emailSendTimes) {
        if (now >= emailTime && (!lastReminderSent || emailTime > lastReminderSent)) {
            const subject = getEmailSubject(notificationType)
            const content = getEmailContent(user.username, notificationType)
        
            try {
                await mailer.sendEmail(user.email, subject, content)
                console.log(`Email has been sent to ${user.email} at ${emailTime.toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })}` )
                emailsSent++

                await new Promise(resolve => setTimeout(resolve, 2000))
            } catch (error) {
                console.error(`Error sending email to ${user.email}: `, error)
            } 
        }
    }
    return emailsSent
}

function getEmailSubject(notificationType) {
    switch (notificationType) {
        case "reminder":
            return "Remember to practice your decks!"
        case "emptyDeck":
            return "Dont forget to add some cards in your decks!"
        case "noDecks": 
            return "It seems like you have not created any decks yet. Create some to be able to start practicing!"
        default:
            return "Notification"
    }
}

function getEmailContent(username, notificationType) {
    switch (notificationType) {
        case "reminder":
            return `Hi ${username}! It is time to practice`
        case "emptyDeck":
            return `Hi ${username}! Please add new cards to your decks!`
        case "noDecks": 
            return `Hi ${username}! You currently have no decks to practice with!`
        default:
            return "Notification"
    }
}
// Run every hour

module.exports = sendScheduledMail