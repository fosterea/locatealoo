from flask import Flask, redirect, render_template, request
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
import json

app = Flask(__name__)

# Index 
@app.route('/')
def index():
	return render_template('index.html')

@app.route('/map')
def map():
  	return render_template('map.html')

# Add a new loo
@app.route('/addloo', methods=['GET', 'POST'])
def add_loo():
	if request.method == 'POST':
		form = request.form
		# Create loo object
		arr = [float(form.get("latitude")), float(form.get("longitude")), form.get("name"), int(form.get("rating")), 1]
		# Load loos, append loo, save loo
		loos = load_data()
		id = loos[-1][5] + 1
		arr.append(id)
		comments = form.get('comments')
		if comments == None:
			comments = ''
		arr.append(comments)
		loos.append(arr)
		with open("loos.json", 'w') as f:
			json.dump(loos, f)
		# Ridirect
		return redirect("/")
	elif request.method == 'GET':
		return render_template('addLoo.html')

@app.route('/getloos')
def get_loos():
	with open('loos.json', 'rb') as f:
		return f.read()

# For reporting a non-loo
@app.route('/reporting', methods=['GET', 'POST'])
def report():
	if request.method == 'GET':
		return render_template('reporting.html', id=int(request.args.get('id')))
	elif request.method == 'POST':
		id = int(request.form.get('id'))
		# Get loo object
		loos = load_data()
		for loo in loos:
			if loo[5] == id:
				# Create string to append
				report = f"Object: {loo}\n\nComments: {request.form.get('comments')}\n---------------\n\n\n"
				# append reports to reports
				with open('static/reports.txt',"a") as f:
					f.write(report)
				break

		return redirect("/map")

# For rating loos
@app.route('/rateloo', methods=['POST'])
def rate_loo():
	id = int(request.form.get('id'))
	rating = float(request.form.get('rating'))

	data = load_data()

	for loo in data:
		if loo[5] == id:
			loo[3] =  round((loo[3] * loo[4] + rating) / (loo[4] + 1), 2)
			loo[4] += 1
			break

	save_json(data)
	
	return redirect("/map")

# Loads loos, returns dict
def load_data():
	with open('loos.json', 'r') as f:
		return json.load(f)

def save_json(obj):
	with open('loos.json', "w") as f:
		json.dump(obj, f)

def errorhandler(e):
    """Handle error"""
    if not isinstance(e, HTTPException):
        e = InternalServerError()
    return (e.name, e.code)


# Listen for errors
for code in default_exceptions:
    app.errorhandler(code)(errorhandler)

if __name__ == '__main__':
	app.run(debug='true')
