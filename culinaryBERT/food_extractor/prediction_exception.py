class PredictionException(Exception):
    """
        This exception is for the instance when culinaryBERT
        produces results that are invalid.

        Args:
            message (str): A message that reflects the exception.
    """
    def __init__(self, message='model has returned an invalid response'):
        self.message = message
        super().__init__(self.message)