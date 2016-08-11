<?php
	$con = mysqli_connect('mydatabase.chn0lilgdyer.us-west-2.rds.amazonaws.com',
						  'appuser','guest','WebAppDB');
	if (!$con) {
		echo ('Could not connect: ' . mysqli_error($con));
	}
	mysqli_select_db($con,"WebAppDB");
	
	$item_array = json_decode($_POST['result'], true); 
	
	$insert_query = "INSERT INTO UserGuesses VALUES ";
	$i = 0;
	$array_count = count($item_array) - 1;

	foreach($item_array as $item) {
		$end = ($i == $array_count) ? ';' : ',';
		$insert_query .= "(".$item[0].",".$item[1].",".$item[2].",".$item[3].",".$item[4].")" . $end;
		$i ++;
	}
	
	$result = mysqli_query($con,$insert_query);
	if($result) {
		echo "Success";
	}
	else {
		echo "Error";
	}
	mysqli_close($con);
?>