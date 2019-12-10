# Primary Draft: Interactive Election Map 2020
<table>
<tr>
<td>
Primary Draft is a Flask web application that simulates a political party's primary elections for experimenting 
with state results and allocating delegates among presidential candidates on an interactive United States map.
</td>
</tr>
</table>

## Live Demo
[PrimaryDraft.com](https://www.PrimaryDraft.com) - Deployed with AWS Elastic Beanstalk

## Preview
![Home Page - Map](https://i.imgur.com/mr8QX4T.png)

## How to Use
<ol type="1">
					<li><strong>Choose a Candidate or Custom Mode</strong>
						<ul>
							<li>'Custom' is the default mode. It allows you to click a
								state and set customized results first and foremost.</li>
							<li>Selecting a candidate allows you to click a state and
								conveniently set your candidate in the lead.</li>
						</ul>
					</li>
					<li><strong>Select a State and Experiment with Results</strong>
						<ul>
							<li>Experiment with a state's statewide results by managing
								percentage points representing the popular vote.</li>
							<li>Unallocated and available percentage points are always
								displayed. Remove points from candidates to give yourself
								a basket of points to use.</li>
							<li>Make use of the 'Custom' mode when diving deep into numerous
								state results. It helps avoid mistakenly overriding already
								modified states with a 'Candidate' click.</li>
						</ul>
					</li>
					<li><strong>Count the Delegates</strong>
						<ul>
							<li>Click 'Count Delegates' to calculate and display the share of
								delegates candidates have recieved exclusively from already customized
								state results (dyed states).</li>
							<li>Hovering over a slice of the donut chart reveals a candidate's overall
								percentage of pledged delegates nationwide as well as their current
								delegate count.</li>
						</ul>
					</li>
				</ol>

## Built With
* [Flask](http://flask.pocoo.org/) - Web Framework for Python
* [SQLite 3](https://www.sqlite.org/index.html) - Relational Database Management System
* [D3.js v4](https://d3js.org/) - Dynamic and Interactive Visualizations with JavaScript
* [TopoJSON](https://github.com/topojson) - Extension of GeoJSON that Encodes Topology
* [jQuery 3.4](https://jquery.com/) - HTML DOM Manipulation with JavaScript
* [Bootstrap 3](https://getbootstrap.com/) - Front-end Framework

## Getting Started

### Requirements
[Python 3.6+](https://www.python.org/)

### Local Installation
Clone the repo:
```
$ git clone https://github.com/OAPadilla/primary-election-app.git
$ cd primary-election-app
```
Create and activate a virtual environment:
```
$ python -m venv venv

Windows
$ venv\Scripts\activate.bat

Unix/MacOS
$ source venv/bin/activate
```
Install the dependencies:
```
$ pip install -r requirements.txt
```
Run the application:
```
$ python application.py
```
Navigate to this URL in your browser:
```
http://localhost:5000
```

## Acknowledgements
Election information sourced from [TheGreenPapers.com](https://www.TheGreenPapers.com)

## Copyright
Copyright © 2019, Oscar Padilla
