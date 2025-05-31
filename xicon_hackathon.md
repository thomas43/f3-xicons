# xicon Hackathon
## F3 Exicon and Lexicon
### Background

The Exicon is a repository of workouts (exercises). They can be formatted in a video, or text. They show proper form and counting.
The Lexicon is a glossary of F3-specific terms.

Historically, the Exicon and Lexicon were managed using a GravityForms plug-in on the Nation’s Wordpress-based website. Last year, we moved our site off of Wordpress. The new platform does not natively offer the capabilities we need to host and manage the Exicon and Lexicon.

The Nation is calling on all developers and enthusiasts to help us build a permanent home for the Exicon and Lexicon. We are looking for PAX who can create a web-based application that will provide all the features needed to host and manage a successful Exicon and Lexicon. Details and requirements for the product can be found below.

### Definitions

The term xicons will refer to both the Exicon and Lexicon.
* Change Log
    * 2025-05-02 - Under Feature Set/Both xicons added: “Submissions from unauthenticated users will need to be approved by authenticated admins prior to being pushed to the front end.”

## Hackathon Format

The hackathon will end at **11:59 PM ET on May 31, 2025**.

### Submitting an Entry

Fill out to officially submit an entry. Submission must be made prior to the deadline.

There is not much we can do to stop you making changes after the deadline, but please try and be fully done by then.

### Submission Requirements

* Submissions can be made by individuals or teams.
* Individuals and teams can enter more than one submission
* Submitters must be members of a local F3 Region.
* The solution must be fully operational.
* The solution must include both the Exicon and the Lexicon.
* Please provide good setup documentation in order for us to easily test/judge your entry
* The solution should be running in an instance of Google Cloud Platform (GCP) or can easily be deployed to GCP.
* Data
* Below is a spreadsheet which houses the current data set for the Exicon and Lexicon. You should populate your solution with this data.
    * see [exicon.csv](exicon.csv) and [lexicon.csv](lexicon.csv)

If you would like to reference videos in your Exicon solution, you can use these: https://www.youtube.com/@f3vexicon 

### Judging

The Nation’s Share Leadership Team (SLT) will judge submissions. There is no quantitative rubric for judging. It will be based on look, usability, maintainability, and cost of ownership.

### Prize

The winner will:
* receive a $150 gift card to .
* have their name or GitHub handle referenced in the final GitHub repo ReadMe.
* be featured in a number of F3 Nation marketing materials including the newsletter and podcasts.

__*If the winning submission was developed by a team, prizes will be shared.__

### Questions

Any questions can be sent to it@f3nation.com . If clarification is needed, this document will be updated. A log will be maintained indicating what was updated, and when.

### Code Ownership & Maintenance

* The winning code for the xicons will reside in a public repo on 
* The code will be open source
* F3 Nation will delegate management of the repo
* Creators and significant contributors will be indicated in the ReadMe

### Tech Stack

The solution can either be a fully custom app, or an off-the-shelf product that is tailored to the needs of F3 Nation.

Specifications for both custom apps and off-the-shelf products:
* The exicon will live at f3nation.com/exicon and the lexicon will live at f3nation.com/lexicon
    * If that is not possible, they can live at exicon.f3nation.com and lexicon.f3nation.com

Specifications for a custom app:
* The app(s) will be hosted on F3 Nation’s Google Cloud Platform (GCP).
* There is no restriction on which GCP resources can be used for the app. But keep the following in mind:
    * F3 is a volunteer organization. Low cost of ownership will be an important factor in choosing a winner.
    * The data for workouts (backblasts and map details) are currently stored in a PostgreSQL database (https://f3-nation.github.io/F3-Data-Models/).
* map.f3nation.com uses https://next-auth.js.org/getting-started/introduction for authentication
    * You don’t have to use this. But we already have the backend set up in PostgreSQL and are leveraging it. So it would be nice to be able to use the same auth system for the xicons as we do maps.

### Feature Set

During judging, preference will be given to the solutions that incorporate as many of these features as possible.

#### Both Xicons
* Content
    * Each entry will have at minimum a name and a description.
    * It may also include a list of aliases (see below).
* Search
    * A search function that searches the name, description, and aliases of each entry.
* Export
    * Full set of entries exportable to CSV.
    * Filtered set of entries exportable to CSV.
* Form factor
    * Work for both mobile and desktop.
* Management
    * There needs to be an easy way for a group of authenticated admins to create, edit, and remove entries.
    * Having a method for bulk operations is ideal.
    * Having both xicons managed from the same backend, and being aware of each other (see references) is ideal.
* Aliases
    * While each entry will have an F3 official name, many regions have their own name.
    * Each entry should have a metadata field associated with it where alternative names can be added.
* Submissions
    * There needs to be a mechanism for unauthenticated users to submit additions and edits.
    * Submissions from unauthenticated users will need to be approved by authenticated admins prior to being pushed to the front end. 
* References
    * Many entries are a variation of another entry (for instance a Crawl Bear is a backwards Bear Crawl).
    * There should be a way to reference or mention other entries by name so that users can link to them.
        * For instance, the description of Bear Crawl may be “moving from one place to another while walking on hands and feet”. And the description of a Crawl Bear might be “It’s a @Bear Crawl, but instead of walking forward, you are walking backwards (i.e., feet first)”.
#### Exicon

* Tags
    * Each entry can have zero, one, or multiple tags.
    * Entries are filterable by tag.
    * Users can determine if tag filtering uses OR or AND.
        * Examples: If the user selects Legs AND Music tag filters, it will return any entries that have both the Leg and Music tag. If the user selects Legs OR Music tag filter, it will return all entries with the Legs tag and all entries with the Music tag.
* Video Integration
    * Either host videos, link to videos, or embed videos.
        * For instance, if a video exists in , include a link in the entry to that specific video in YouTube.

#### Lexicon

The Lexicon has no features that are not listed in the Both section. 

### Legal

When submitting your entry, you will be asked to agree to the below legal statement.

```
Hackathon Terms and Disclaimer: This hackathon (“Event”) is organized and hosted by F3 Nation, Inc. (“F3 Nation”). By participating in the Event, each participant (“Participant”) acknowledges and agrees that any code, prototypes, documentation, designs, or other materials submitted, presented, or developed during the Event (collectively, “Submissions”) become the sole and exclusive property of F3 Nation. Participants will receive appropriate credit and attribution for their contributions, but waive any rights of ownership, compensation, or royalties unless otherwise agreed to in writing by F3 Nation. The Event is provided “as is” without any warranties, express or implied. F3 Nation and its affiliates, officers, directors, employees, sponsors, and agents (collectively, the “Organizers”) disclaim all liability for any direct, indirect, incidental, or consequential damages, including but not limited to lost profits, data loss, or personal injury, arising from or in connection with participation in the Event. By attending or participating, each Participant assumes all associated risks and releases the Organizers from any and all claims to the fullest extent permitted by law.```
