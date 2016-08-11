<?php
	$con = mysqli_connect('mydatabase.chn0lilgdyer.us-west-2.rds.amazonaws.com',
						  'appuser','guest','WebAppDB');
	if (!$con) {
		echo ('Could not connect: ' . mysqli_error($con));
	}

	mysqli_select_db($con,"WebAppDB");
	
	/* select 10 random numbers between 1 and 200 */
	$Ids = "";
	
	for( $i = 0; $i < 10 ; $i ++){
		$Ids = $Ids . rand(0, 199) . ($i == 9 ? "" : ",");
	}
	
	$sql = "SELECT * FROM WebAppDB.BIGT where IdDeck in (". $Ids . ");";
	
	$result = mysqli_query($con,$sql);
	
	$rows = array();
	while($r = mysqli_fetch_assoc($result)) {
		$rows[] = $r;
	}
	
	print json_encode($rows);
	mysqli_close($con);
?>