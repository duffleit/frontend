# Roadmap

This document summarizes ideas and tries to group them into categories / topics. This list is unordered.
The purpose of this document is to gather ideas and refine requirements out of them in order to finally create issues as specific tasks for implementation.

## Deleting / Editing bills

Deleting or editing bills is a major requirement that has to implemented in one way or another. Due to the lack of accounts, it is hard to be implement privileged functionality that would allow destructive actions. The design-goal for these features therefore has to be "always undo" and should allow every user to always undo any action that has been executed.

- Deleting a bill: This should not really delete a bill but rather "hide" it from the nobt or mark it as old / unnecessary
- Editing a bill: Every edit of a bill should result in a new version and every version should be restore-able. Another idea would be to lock certain elements from being changed (maybe only one thing at a time?)

## Balances and "tickable" transactions

Currently, the final transactions that describe all debts are transient, i.e. calculated on-the-fly when the nobt is retrieved from the server. This means, that the individual transactions are not addressable and therefore, no state can be saved for them. In order to simplify the whole settling process, a feature called "freeze nobt" could be introduced. Freezing a nobt would persist the current transactions into the database and prohibits further bills from being added to the nobt. Persisting the transactions to the database makes them addressable, which means that we can implement a UI that allows users to "tick-off" individual transactions and thereby mark them as paid.

A different way that would still allow to add further bills would be to mark all current bills as "processed" and merge the persisted transactions with the once resulting from the new bills. This would make it possible to tick-off individual transactions. However, a major problem to be solved concerning UX is how to communicate to the user, why some transactions can be ticked off and some cannot. It is probably easier to understand, that no bills can be added until all the transactions are ticked off.

## Richer Bills

- Currency Conversion
- Location
- Images
- Comments
- More than one debtor
- More Split-Strategies

Adding these elements to bills requires a lot more space on the UI compared to now. This will probably require a wizard or something similar.

## Global Nobt Settings

- Choose the way transactions are simplified
  - Minimal amount transferred
  - Minimal number of transactions
  - No simplification
- Change default currency?

## Personalization

- Remember visited nobts: Should allow the user to re-visit a nobt if they loose the link and visit nobt.io, or my.nobt.io for example
- "Choose yourself": Users should be able to select themselves out of the list of persons in the nobt.

Both of these features require some kind of local storage to be used on the device. As soon as we implement the first kind of these features, we should keep in mind that we have to pay attention to the format we use for storing that information. The moment we persist information to a customer's device, we don't know when the user will access the nobt the next time. Therefore, breaking changes in the format in which we store data are either to be avoided, or we have to think of some kind of migration path from the old to the new format. A general advice would therefore be to very carefully think about the data format we use in storing information on the client and design it in a way that is highly extensible.

## Progressive Web App

1. Cache shell
2. Offline read-only access (Service Worker caches nobt response)
3. Offline write access (Service worker needs to simulate API response)
4. Notifications about changes to the nobt

Overall, a real advantage for the user is only gained as soon as we reach stage 2 (offline read access). However, in terms of incremental delivery, we can ship stage 1 independently.
