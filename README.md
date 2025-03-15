# Resume Builder 

<p>The Resume Builder is a full-stack web application that allows users to create, edit, and download their resumes in PDF format. 
  The app features real-time editing, a live preview, and PDF export functionality to help users easily craft professional resumes.</p>

<img src="Github-Images/livepreview.gif" alt="gif of live preview" style="max-width: 100%;" />
<img src="Github-Images/import.gif" alt="image of experience" style="width: 900px;" />

## Table of Contents
- [Main Features](#main-features)
  - [Simplified Structure](#simplified-structure) 
  - [PDF Export Functionality](#pdf-export-functionality)
  - [Real-Time Editing](#real-time-editing)
  - [JSON Import/Export](#json-importing-and-exporting) 
- [Technologies Used](#technologies-used)

## Main Features

### Simplified Structure
The user interface is designed to provide a straightforward, easy-to-navigate experience that highlights key features without unnecessary complexity.

<img src="Github-Images/structure.png" alt="gif of live preview" style="max-width: 100%;" />

### PDF Export Functionality
Once the resume is complete, users can export it as a professional PDF for download, ready to be shared or printed.

<img src="Github-Images/exportpdf.gif" alt="gif of live preview" style="max-width: 100%;" />

### Real-Time Editing
Users can see changes instantly as they make edits, enabling a seamless experience while creating or modifying their resumes.

<img src="Github-Images/livepreview2.gif" alt="gif of live preview" style="max-width: 100%;" />

### JSON Importing and Exporting
Users are able to import/export existing resumes or data from a JSON file, allowing them to quickly start editing without manually re-entering information. This feature ensures that users are able to update or refine their resumes efficiently, while also laying the foundation for future database storage. 

<img src="Github-Images/import.gif" alt="gif of live preview" style="max-width: 100%;" />

## Technologies Used
- **jQuery & JavaScript**: Used for simplifying DOM manipulation and event handling in the web application, used for user interactions and provide dynamic content updates.
- **C#**: Utilized for server-side development, particularly for handling PDF generation in the Resume Builder Web App. It allowed for the development of efficient back-end functionality and seamless integration with PDFsharp for creating downloadable resumes.
- **PDFsharp**: Used in the Resume Builder Web App to generate and export resumes as PDF documents. PDFsharp helped in dynamically creating PDF files from user input, ensuring the app could offer a professional, shareable resume format.
