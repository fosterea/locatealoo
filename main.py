from flask import Flask, redirect, render_template, request
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
import json

app = Flask(__name__)

PASSWORD = 'del'

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
		id = max_id_plus_plus()
		arr.append(id)
		comments = form.get('comments')
		if comments == None:
			comments = ''
		arr.append(comments)
		loos.append(arr)
		with open("loos.json", 'w') as f:
			json.dump(loos, f)
		# Ridirect
		return redirect("/map")
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
				with open('reports.json', 'r') as f:
					reports = json.load(f)
				reports.append({"comments" : request.form.get('comments'), 'entry' : loo})
				with open('reports.json',"w") as f:
					json.dump(reports, f)
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

@app.route("/reports", methods=["GET", "POST"])
def get_reports():
	def remove_all_reports(id, reports):
		del_list = []
		for i in range(len(reports)):
			if reports[i]['entry'][5] == id:
				del_list.append(i)
		for index in reversed(del_list):
			del reports[index]
				
	def remove_loo(id):
		loos = load_data()
		for i in range(len(loos)):
			if loos[i][5] == id:
				del loos[i]
				break
		save_json(loos)

	if request.method == "POST" and request.form.get('password') == PASSWORD:
		form = request.form
		id = int(form.get('id'))
		reports = load_json('reports.json')
		if form.get('action') == 'keep':
			comments = form.get('comments')
			
			i = 0;
			for report in reports:
				if report['entry'][5] == id and report['comments'] == comments:
					break
				i += 1
			del reports[i]
		elif form.get('action') == 'remove':
			remove_all_reports(id=id, reports=reports)
			remove_loo(id=id)
		with open('reports.json', 'w') as f:
			json.dump(reports, f)
	return render_template('reports.html', reports=load_json('reports.json'))



# Loads loos, returns dict
def load_data():
	with open('loos.json', 'r') as f:
		return json.load(f)

def save_json(obj):
	with open('loos.json', "w") as f:
		json.dump(obj, f)

def load_json(fp):
	with open(fp, 'r') as f:
		return json.load(f)

# Returns and increments the current id
def max_id_plus_plus():
	with open('max_id.txt', 'r') as f:
		id = int(f.read()) + 1
	with open('max_id.txt', 'w') as f:
		f.write(str(id))
	return id


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
