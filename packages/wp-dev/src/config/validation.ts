import Joi from 'joi';

export const validateCommanderOptions = ( options: any ) => {
	const schema = Joi.object( {
		config: Joi.string(),
	} );

	return schema.validate( options );
};
