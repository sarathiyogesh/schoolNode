const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

module.exports.getOneByField = (Model,fields) => catchAsync(async (req,res,next) => {
	console.log('working..........');
	const doc = await Model.findOne({email: 'sivaneshmca@gmail.com'});
	return doc;
});

exports.createOne = Model => catchAsync(async (req,res,next) => {
	const newDoc = await Model.create(req.body);
	res.status(201).json({ 
		status:'success', 
		data: {
			data: newDoc,
		} 
	});
});

exports.getAll = (Model) => catchAsync(async (req,res,next) => {

	let filter = { };
	if(req.params.tourId){ filter = { tour: req.params.tourId } };

	const features = new APIFeatures(Model.find(filter), req.query).filter().sorting().limitFields().paginate();
	//const doc = await features.query.explain();
	const doc = await features.query;
	res.status(200).json({ 
		status:'success', 
		result: doc.length,
		data: {
			data: doc,
		} 
	});
});