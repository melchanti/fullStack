***Introduction***
https://studies.cs.helsinki.fi/exampleapp/

We will be using this application throughout this section.

***HTTP GET***
The server and the web browser communicate with each other using the HTTP protocol
When you click on the link above, the browser has completed two events:
  - The browser fetched the contents of the page `studies.cs.helsinki.fi/exampleapp` from the server
  - Downloaded teh image `kuva.png`

The response headers tell us information about the response. It includes various header and an important header is the `Content-Type`
This way the browser knows the response to be of its data type and render the browser accordingly.
The response tap show the response data

Because of the image tag in the body of the response, the browser makes another request to fetch the imag.
Even though it's difficult to tell, the HTML page begins to render before the image has been fetched from the server.

***Traditional Web Applications***
The homepage of the example applications works like a traditional web application. When entering the page, the browser fetches the HTML document detailing the structure and the textual content of the page from the server.

The document can be a static text file saved into the server's directory and the server can also form the HTML documents dynamically according to the application code
In traditional we applications, the browser is "dumb". It only fetches HTML data from the server, and all application logic is on the server.

***Running application logic in the browser***
The browser can be used to run code

***Event handlers and Callback functions***
Event handler functions are called callback functions
The application code does not invoke the functions itself, but the runtime environment - the browser, invokes the function at an appropraite time, when the event has occurred.

***Document Object Model or DOM***
We can think of HTML-pages as implicit tree structures
The functioning of the browser is based on the idea of depicting HTML elements as a tree
Document Object Model, or DOM, is an Application Programming Interface (API) which enables programmatic modification of the element trees corresponding to web-pages

***Manipulating the document-object from console***
The topmost node of the DOM tree of an HTML document is called the `document` object

***CSS***
A class selector definition always starts with a period, and contains the name of the class
Classes are attributes that can be added to HTML elements
CSS attributes can be examined on the elements tab of the console

***Loading a page containing JS - review***
1. The browser fetches the HTML code defining the content and the structure of the page from the server using an HTTP GET request
2. Links in the HTML code cause the browser to also fetch the CSS style sheet `main.css`
3. ... and a JS code file `main.js`
4. The brwoser executes the JS code. The code makes an HTTP GET request to an address, which returns the notes as JSON data
5. When the data has been fetched, the browser executes an event handler, which renders the notes to the page using the DOM-API

***Form and HTTP POST***
With a form request, you submit an HTTP POST request
The server usually responds with HTTP status code 302 which is a URL redirect
Using the redirect, the server asks the browser to do a new HTTP GET request to the address defined in the header's location

***AJAX***
AJAX is a term introduced in Feb 2005 on the back of advancements in browser technology to describe a new revolutionary approach that enabled the fetching of content to web pages using JS included with the HTML, without the need to rerender teh page

Submitting the form still uses the traditional mechanism of submitting web-forms
The application URLs reflect the old, carefree times. JSON data is fetched from the url and new notes are sent to the URL

Nowadays URLs like these would not be acceptable, as they don't follow the generally acknowledged convents of RESTful APIs

***Single Page APP***
Single-page application(SPA) style websites don't fetch all of their pages separately from the server like our sample application does, but instead comprise only one HTML page fetched from the server, the contents of which are manipulated with JS that executes in the browser.

The callback for a form submit creates a new noted, adds it to the notes list, rerenders the note list on the page and send the new note to the server without getting a new resource from the server.


***JS libraries***
Different libraries containing tools that are easier to work with compared to the DOM-API are often used to mainpulate pages

`jQuery` was developed back when web applications mainly followed the traditional style of the server generating HTML pages, the functionality of which was enhanced on the browser side using JS written with jQuery.

Nowadays using jQuery is not as justified given the advancements of JS, and the most popular browsers support basic functionalities well.

Currently, the most popular tool for implementing the browser-side logic of web-applications is Facebook's React library

***Full stack web development***
Full stack refers to the frontend (the browser), the backend (server), and the database

