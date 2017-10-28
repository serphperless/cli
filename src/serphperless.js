#!/usr/bin/env node

const main = async (argv_) => {
    console.log('Welcome!')
}

const handleRejection = err => {
    debug('handling rejection')
    if (err) {
        if (err instanceof Error) {
            handleUnexpected(err)
        } else {
            console.error(error(`An unexpected rejection occurred\n  ${err}`))
        }
    } else {
        console.error(error('An unexpected empty rejection occurred'))
    }
    process.exit(1)
}

const handleUnexpected = err => {
    debug('handling unexpected error')
    console.error(
        error(`An unexpected error occurred!\n  ${err.stack} ${err.stack}`)
    )
    process.exit(1)
}

process.on('unhandledRejection', handleRejection)
process.on('uncaughtException', handleUnexpected)

main(process.argv).catch(handleUnexpected)
