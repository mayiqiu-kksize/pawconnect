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
- pet.html – each pet profile has a Contact Shelter button that opens an enquiry form; an empty question is not sent, and a sent enquiry is saved with a reference number and a confirmation (US5)
- login.html, account.html – log in and adopter account; account.html lists the adopter's applications with the shelter, date and the latest status set by shelter staff (US8)
- staff.html, staff-pets.html, staff-applications.html, staff-enquiries.html – staff area with a staff menu (US18). Adopters who open these pages see "Access denied"; visitors are sent to Log in and returned to the page afterwards
- staff-pets.html – shelter staff add new pets and edit details and status for their own shelter (US3). Saved changes are stored in this browser and appear on Browse Pets and the pet profiles; pets set to Adopted leave Browse Pets and no longer accept applications. To reset the demo pets, clear this site's data in the browser
- staff-applications.html – shelter staff review the applications submitted to their shelter, see the applicant's and pet's details, and change the status (Submitted, Under Review, Approved, Declined) (US4). Three demo applications are added in a fresh browser; staff cannot open an application from another shelter (try staff-applications.html?id=APP-100103)
- signup.html – create a new adopter account (US16); the new account is saved in this browser and logged in straight away
- privacy.html – Privacy Policy (linked from the application form and the footer)

## Photos

The photos of Luna, Sunny, Daisy, Archie and Pip are used with the permission of their owners.
