import Joi from 'joi';

export const validateCommanderOptions = ( options: any ) => {
	const schema = Joi.object( {
		config: Joi.string(),
	} );

	return schema.validate( options );
};

export const validateWpDevConfiguration = ( obj: any ) => {
	const schema = Joi.object( {} );
	return schema.validate( obj );
};
