# PawConnect

Pet adoption prototype for the PMGT5871 Team 10 Scrum project.

Live site: https://mayiqiu-kksize.github.io/pawconnect/

## Demo accounts (US17)

| Role | Email | Password | Lands on |
| --- | --- | --- | --- |
| Adopter | emily@pawconnect.test | Adopt1234 | account.html |
| Shelter staff (Harbour Paws Rescue) | sarah@harbourpaws.test | Staff1234 | staff.html |

This is a prototype. Accounts, passwords and the login session are stored in the browser's localStorage for demonstration only; a real system would use a secure server.

## Pages

- index.html – home
- browse.html – pets available for adoption (browse.html?demo=empty shows the empty state)
- pet.html?id=p1 … p6 – pet profiles with photo gallery, vaccination details and the adoption application form (Sunny p3 and Daisy p4 have several photos)
- login.html, account.html – log in and adopter account
- staff.html, staff-pets.html, staff-applications.html, staff-enquiries.html – staff area with a staff menu (US18). Adopters who open these pages see "Access denied"; visitors are sent to Log in and returned to the page afterwards
- staff-pets.html – shelter staff add new pets and edit details and status for their own shelter (US3). Saved changes are stored in this browser and appear on Browse Pets and the pet profiles; pets set to Adopted leave Browse Pets and no longer accept applications. To reset the demo pets, clear this site's data in the browser
- signup.html – create a new adopter account (US16); the new account is saved in this browser and logged in straight away
- privacy.html – Privacy Policy (linked from the application form and the footer)

## Photos

The photos of Luna, Sunny, Daisy, Archie and Pip are used with the permission of their owners.
