const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const job = await Job.findOne({ _id: id, createdBy: userId });
  if (!job) throw new NotFoundError(`Job with id ${id} not exist`);

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json(job);
  // try {
  //   const job = await Job.create(req.body);
  //   res.status(201).json({ success: true, job });
  // } catch (error) {
  //   console.log(error);
  // }
};

const updateJob = async (req, res) => {
  const {
    params: { id: jobID },
    user: { userId },
    body: { company, position },
  } = req;
  if (!company || !position)
    throw new BadRequestError('Company or Position field cannot be empty');

  const job = await Job.findOneAndUpdate(
    { _id: jobID, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) throw new NotFoundError(`Job with id ${id} not exist`);
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    params: { id: jobID },
    user: { userId },
  } = req;

  const job = await Job.findOneAndRemove({ _id: jobID, createdBy: userId });

  if (!job) throw new NotFoundError(`Job with id ${id} not exist`);
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
